import { getDemoStore, hydrateUserTiers } from "@/lib/demo-store";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { buildSearchKeywords, matchesSearch } from "@/lib/search";
import { toSlug } from "@/lib/utils";
import {
  calculateTradeCompletionXp,
  getEffectiveXp,
  getTierFromXp,
  recentlyBoosted,
} from "@/lib/xp";
import type {
  AppSnapshot,
  Leaderboard,
  LeaderboardEntry,
  Listing,
  ListingWithOwner,
  Notification,
  Review,
  TradeMessage,
  TradeProposal,
  TradeProposalWithContext,
  TradeStashUser,
  TradeStatus,
} from "@/lib/types";

type CollectionName =
  | "users"
  | "listings"
  | "tradeProposals"
  | "tradeMessages"
  | "leaderboards"
  | "reviews"
  | "notifications";

type AuthenticatedRequestUser = Pick<TradeStashUser, "id" | "email" | "displayName">;

const collectionNames: CollectionName[] = [
  "users",
  "listings",
  "tradeProposals",
  "tradeMessages",
  "leaderboards",
  "reviews",
  "notifications",
];

async function readCollection<T>(collectionName: CollectionName) {
  const db = getAdminDb();
  if (!db) {
    return null;
  }

  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

async function getWritableStore() {
  return getAdminDb() ? await loadAppSnapshot() : getDemoStore();
}

export async function loadAppSnapshot(): Promise<AppSnapshot> {
  const db = getAdminDb();
  if (!db) {
    return hydrateUserTiers();
  }

  const [users, listings, tradeProposals, tradeMessages, leaderboards, reviews, notifications] =
    await Promise.all(
      collectionNames.map((collectionName) => readCollection(collectionName)),
    );

  return {
    users: (users ?? []) as TradeStashUser[],
    listings: (listings ?? []) as Listing[],
    tradeProposals: (tradeProposals ?? []) as TradeProposal[],
    tradeMessages: (tradeMessages ?? []) as TradeMessage[],
    leaderboards: (leaderboards ?? []) as Leaderboard[],
    reviews: (reviews ?? []) as Review[],
    notifications: (notifications ?? []) as Notification[],
  };
}

async function upsertDoc<T extends { id: string }>(
  collectionName: CollectionName,
  doc: T,
) {
  const db = getAdminDb();
  if (!db) {
    return;
  }

  await db.collection(collectionName).doc(doc.id).set(doc, { merge: true });
}

export async function deleteDoc(collectionName: CollectionName, id: string) {
  const db = getAdminDb();
  if (!db) {
    return;
  }

  await db.collection(collectionName).doc(id).delete();
}

export async function verifyRequestUser(authorization?: string | null) {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const auth = getAdminAuth();
  if (!auth) {
    return null;
  }

  const token = authorization.replace("Bearer ", "");
  const decoded = await auth.verifyIdToken(token);
  return {
    id: decoded.uid,
    email: decoded.email ?? "",
    displayName: decoded.name ?? decoded.email?.split("@")[0] ?? "Trader",
  } satisfies AuthenticatedRequestUser;
}

export async function resolveActor(options: {
  authorization?: string | null;
  demoUserId?: string | null;
}) {
  const liveUser = await verifyRequestUser(options.authorization);
  if (liveUser) {
    return liveUser;
  }

  if (options.demoUserId) {
    const store = getDemoStore();
    const match = store.users.find((user) => user.id === options.demoUserId);
    if (match) {
      return {
        id: match.id,
        email: match.email,
        displayName: match.displayName,
      } satisfies AuthenticatedRequestUser;
    }
  }

  return null;
}

export function buildProposalContext(
  snapshot: AppSnapshot,
  proposal: TradeProposal,
): TradeProposalWithContext {
  return {
    ...proposal,
    offerer: snapshot.users.find((user) => user.id === proposal.offererId),
    receiver: snapshot.users.find((user) => user.id === proposal.receiverId),
    offeredListing: snapshot.listings.find(
      (listing) => listing.id === proposal.offeredListingId,
    ),
    requestedListing: snapshot.listings.find(
      (listing) => listing.id === proposal.requestedListingId,
    ),
    messages: snapshot.tradeMessages
      .filter((message) => message.proposalId === proposal.id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

function attachOwners(snapshot: AppSnapshot, listings: Listing[]) {
  return listings
    .map((listing) => {
      const owner = snapshot.users.find((user) => user.id === listing.userId);
      return {
        ...listing,
        owner,
        isLegendBoost: owner?.tier === "Legend" || recentlyBoosted(listing.boostExpiry),
      } satisfies ListingWithOwner;
    })
    .sort((a, b) => {
      const aBoost = Number(a.isLegendBoost);
      const bBoost = Number(b.isLegendBoost);
      if (aBoost !== bBoost) {
        return bBoost - aBoost;
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
}

export async function getListings(filters?: {
  query?: string;
  category?: string;
  city?: string;
  ownerId?: string;
  includeInactive?: boolean;
}) {
  const snapshot = await loadAppSnapshot();
  const filtered = snapshot.listings.filter((listing) => {
    if (!filters?.includeInactive && listing.status !== "active") {
      return false;
    }

    if (filters?.ownerId && listing.userId !== filters.ownerId) {
      return false;
    }

    if (filters?.category && filters.category !== "All" && listing.category !== filters.category) {
      return false;
    }

    if (filters?.city && listing.location.city !== filters.city) {
      return false;
    }

    return matchesSearch({
      haystack: [
        ...listing.searchKeywords,
        listing.title.toLowerCase(),
        listing.description.toLowerCase(),
        listing.category.toLowerCase(),
      ],
      query: filters?.query,
    });
  });

  return attachOwners(snapshot, filtered);
}

export async function getFeaturedListings(limit = 4) {
  const listings = await getListings();
  return listings.slice(0, limit);
}

export async function getListingById(listingId: string) {
  const snapshot = await loadAppSnapshot();
  const listing = snapshot.listings.find((item) => item.id === listingId);
  if (!listing) {
    return null;
  }

  return attachOwners(snapshot, [listing])[0] ?? null;
}

export async function getUserProfile(userId: string) {
  const snapshot = await loadAppSnapshot();
  const user = snapshot.users.find((entry) => entry.id === userId);
  if (!user) {
    return null;
  }

  const listings = attachOwners(
    snapshot,
    snapshot.listings.filter((listing) => listing.userId === userId),
  );

  const proposals = snapshot.tradeProposals
    .filter((proposal) => proposal.offererId === userId || proposal.receiverId === userId)
    .map((proposal) => buildProposalContext(snapshot, proposal))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const reviews = snapshot.reviews
    .filter((review) => review.toUserId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    user: {
      ...user,
      xp: getEffectiveXp(user),
      tier: getTierFromXp(getEffectiveXp(user)),
    },
    listings,
    proposals,
    reviews,
  };
}

export async function getLeaderboard(city?: string) {
  const snapshot = await loadAppSnapshot();
  const cities = city ? [city] : Array.from(new Set(snapshot.users.map((user) => user.city)));

  return cities
    .map((cityName) => {
      const users = snapshot.users
        .filter((user) => user.city === cityName)
        .map(
          (user) =>
            ({
              uid: user.id,
              displayName: user.displayName,
              city: user.city,
              campus: user.campus,
              xp: getEffectiveXp(user),
              tier: getTierFromXp(getEffectiveXp(user)),
              verifiedBadge: user.verifiedBadge === "verified",
              completedTrades: user.completedTrades,
              streakDays: user.streakDays,
            }) satisfies LeaderboardEntry,
        )
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10);

      return {
        city: cityName,
        monthKey: new Date().toISOString().slice(0, 7),
        generatedAt: new Date().toISOString(),
        hallOfFame: snapshot.users
          .filter((user) => user.city === cityName && user.tier === "Legend")
          .map((user) => user.id),
        topUsers: users,
      } satisfies Leaderboard;
    })
    .sort((a, b) => a.city.localeCompare(b.city));
}

export async function getMarketSnapshot() {
  const snapshot = await loadAppSnapshot();
  const liveListings = snapshot.listings.filter((listing) => listing.status === "active").length;
  const completedTrades = snapshot.users.reduce(
    (sum, user) => sum + user.completedTrades,
    0,
  );
  const legends = snapshot.users.filter((user) => user.tier === "Legend").length;

  return {
    users: snapshot.users.length,
    liveListings,
    completedTrades,
    legends,
  };
}

export async function getTradeProposalById(proposalId: string) {
  const snapshot = await loadAppSnapshot();
  const proposal = snapshot.tradeProposals.find((entry) => entry.id === proposalId);

  return proposal ? buildProposalContext(snapshot, proposal) : null;
}

export async function getDashboardForUser(userId: string) {
  const snapshot = await loadAppSnapshot();
  const user = snapshot.users.find((entry) => entry.id === userId);
  if (!user) {
    return null;
  }

  return {
    user: {
      ...user,
      xp: getEffectiveXp(user),
      tier: getTierFromXp(getEffectiveXp(user)),
    },
    activeListings: attachOwners(
      snapshot,
      snapshot.listings.filter((listing) => listing.userId === userId),
    ),
    proposals: snapshot.tradeProposals
      .filter((proposal) => proposal.offererId === userId || proposal.receiverId === userId)
      .map((proposal) => buildProposalContext(snapshot, proposal))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    notifications: snapshot.notifications
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8),
    reviews: snapshot.reviews
      .filter((review) => review.toUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export async function bootstrapUserRecord(args: {
  actor: AuthenticatedRequestUser;
  city: string;
  campus?: string;
  photoURL?: string;
}) {
  const timestamp = new Date().toISOString();
  const db = getAdminDb();
  const store = await getWritableStore();

  const current =
    store.users.find((user) => user.id === args.actor.id) ??
    ({
      id: args.actor.id,
      displayName: args.actor.displayName,
      email: args.actor.email,
      city: args.city,
      campus: args.campus,
      region: "DMV",
      xp: 0,
      tier: "Scout",
      streakDays: 0,
      lastTradeDate: null,
      lastActiveAt: timestamp,
      verifiedBadge: "none",
      photoURL: args.photoURL,
      completedTrades: 0,
      pendingTrades: 0,
      bio: "Fresh TradeStash profile.",
    } satisfies TradeStashUser);

  const nextUser: TradeStashUser = {
    ...current,
    displayName: args.actor.displayName,
    email: args.actor.email,
    city: args.city,
    campus: args.campus,
    photoURL: args.photoURL || current.photoURL,
    lastActiveAt: timestamp,
  };

  const existingIndex = store.users.findIndex((user) => user.id === nextUser.id);
  if (existingIndex >= 0) {
    store.users[existingIndex] = nextUser;
  } else {
    store.users.push(nextUser);
  }

  if (db) {
    await upsertDoc("users", nextUser);
  }

  return nextUser;
}

export async function createListing(args: {
  actor: AuthenticatedRequestUser;
  input: {
    title: string;
    description: string;
    category: Listing["category"];
    condition: Listing["condition"];
    photos: string[];
    city: string;
    zipCode?: string;
    campus?: string;
    lat?: number;
    lng?: number;
    wantInReturnMode: Listing["wantInReturnMode"];
    wantInReturnText?: string;
    wantInReturnCategory?: Listing["wantInReturnCategory"];
  };
}) {
  const store = await getWritableStore();
  const timestamp = new Date().toISOString();
  const id = `listing-${Date.now().toString(36)}`;
  const listing: Listing = {
    id,
    userId: args.actor.id,
    title: args.input.title,
    description: args.input.description,
    category: args.input.category,
    condition: args.input.condition,
    photos: args.input.photos,
    location: {
      city: args.input.city,
      zipCode: args.input.zipCode,
      campus: args.input.campus,
      lat: args.input.lat,
      lng: args.input.lng,
    },
    wantInReturnMode: args.input.wantInReturnMode,
    wantInReturnText: args.input.wantInReturnText,
    wantInReturnCategory: args.input.wantInReturnCategory,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    boostExpiry: null,
    searchKeywords: buildSearchKeywords([
      args.input.title,
      args.input.description,
      args.input.category,
      args.input.wantInReturnText ?? "",
    ]),
  };

  store.listings.unshift(listing);
  await upsertDoc("listings", listing);
  return listing;
}

function updateUserPendingTradeCount(store: AppSnapshot, userId: string) {
  const user = store.users.find((entry) => entry.id === userId);
  if (!user) {
    return;
  }

  user.pendingTrades = store.tradeProposals.filter(
    (proposal) =>
      (proposal.offererId === userId || proposal.receiverId === userId) &&
      proposal.status !== "completed" &&
      proposal.status !== "rejected",
  ).length;
}

async function createNotification(notification: Notification) {
  const store = await getWritableStore();
  store.notifications.unshift(notification);
  await upsertDoc("notifications", notification);
}

export async function createTradeProposal(args: {
  actor: AuthenticatedRequestUser;
  offeredListingId: string;
  requestedListingId: string;
}) {
  const store = await getWritableStore();
  const offeredListing = store.listings.find(
    (listing) => listing.id === args.offeredListingId,
  );
  const requestedListing = store.listings.find(
    (listing) => listing.id === args.requestedListingId,
  );

  if (!offeredListing || !requestedListing) {
    throw new Error("Listing not found.");
  }

  if (offeredListing.userId !== args.actor.id) {
    throw new Error("You can only offer your own listings.");
  }

  if (requestedListing.userId === args.actor.id) {
    throw new Error("You cannot trade for your own listing.");
  }

  const existing = store.tradeProposals.find(
    (proposal) =>
      proposal.offeredListingId === args.offeredListingId &&
      proposal.requestedListingId === args.requestedListingId &&
      proposal.status === "pending",
  );

  if (existing) {
    return existing;
  }

  const timestamp = new Date().toISOString();
  const proposal: TradeProposal = {
    id: `proposal-${Date.now().toString(36)}`,
    offererId: args.actor.id,
    receiverId: requestedListing.userId,
    offeredListingId: args.offeredListingId,
    requestedListingId: args.requestedListingId,
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
    deliveryRequested: false,
    lastMessageAt: null,
  };

  store.tradeProposals.unshift(proposal);
  updateUserPendingTradeCount(store, proposal.offererId);
  updateUserPendingTradeCount(store, proposal.receiverId);
  await upsertDoc("tradeProposals", proposal);
  const receiver = store.users.find((user) => user.id === proposal.receiverId);

  if (receiver) {
    await createNotification({
      id: `notif-${Date.now().toString(36)}`,
      userId: receiver.id,
      type: "proposal",
      title: "New trade proposal",
      body: `${args.actor.displayName} offered ${offeredListing.title} for your ${requestedListing.title}.`,
      link: `/trades/${proposal.id}`,
      read: false,
      createdAt: timestamp,
    });
  }

  return proposal;
}

async function rebuildLeaderboardsForCities(store: AppSnapshot, cities: string[]) {
  for (const city of cities) {
    const leaderboard = (
      await getLeaderboard(city)
    )[0];

    const existingIndex = store.leaderboards.findIndex((entry) => entry.city === city);
    if (existingIndex >= 0) {
      store.leaderboards[existingIndex] = leaderboard;
    } else {
      store.leaderboards.push(leaderboard);
    }

    await upsertDoc("leaderboards", {
      ...leaderboard,
      id: toSlug(city),
    });
  }
}

export async function updateTradeProposalStatus(args: {
  actor: AuthenticatedRequestUser;
  proposalId: string;
  status: TradeStatus;
}) {
  const store = await getWritableStore();
  const proposal = store.tradeProposals.find((entry) => entry.id === args.proposalId);
  if (!proposal) {
    throw new Error("Trade proposal not found.");
  }

  if (![proposal.offererId, proposal.receiverId].includes(args.actor.id)) {
    throw new Error("You are not allowed to update this proposal.");
  }

  const offeredListing = store.listings.find(
    (listing) => listing.id === proposal.offeredListingId,
  );
  const requestedListing = store.listings.find(
    (listing) => listing.id === proposal.requestedListingId,
  );

  if (!offeredListing || !requestedListing) {
    throw new Error("Trade listings are missing.");
  }

  const timestamp = new Date().toISOString();
  proposal.status = args.status;
  proposal.updatedAt = timestamp;

  if (args.status === "accepted") {
    offeredListing.status = "pending";
    requestedListing.status = "pending";
  }

  if (args.status === "rejected") {
    offeredListing.status = "active";
    requestedListing.status = "active";
  }

  if (args.status === "completed") {
    offeredListing.status = "traded";
    requestedListing.status = "traded";

    const users = [
      store.users.find((user) => user.id === proposal.offererId),
      store.users.find((user) => user.id === proposal.receiverId),
    ].filter(Boolean) as TradeStashUser[];

    for (const user of users) {
      const xp = calculateTradeCompletionXp({
        user,
        offerLocation: offeredListing.location,
        requestLocation: requestedListing.location,
      });

      user.xp += xp.awardedXp;
      user.tier = getTierFromXp(user.xp);
      user.streakDays = xp.streakDays;
      user.completedTrades += 1;
      user.lastTradeDate = timestamp;
      user.lastActiveAt = timestamp;
      updateUserPendingTradeCount(store, user.id);
      await upsertDoc("users", user);
    }

    await rebuildLeaderboardsForCities(store, [
      offeredListing.location.city,
      requestedListing.location.city,
    ]);
  }

  updateUserPendingTradeCount(store, proposal.offererId);
  updateUserPendingTradeCount(store, proposal.receiverId);
  await upsertDoc("tradeProposals", proposal);
  await upsertDoc("listings", offeredListing);
  await upsertDoc("listings", requestedListing);

  const recipientId =
    args.actor.id === proposal.offererId ? proposal.receiverId : proposal.offererId;

  await createNotification({
    id: `notif-${Date.now().toString(36)}`,
    userId: recipientId,
    type: "trade",
    title: `Trade ${args.status}`,
    body: `${args.actor.displayName} marked the proposal as ${args.status}.`,
    link: `/trades/${proposal.id}`,
    read: false,
    createdAt: timestamp,
  });

  return buildProposalContext(store, proposal);
}

export async function appendTradeMessage(args: {
  actor: AuthenticatedRequestUser;
  proposalId: string;
  body: string;
}) {
  const store = await getWritableStore();
  const proposal = store.tradeProposals.find((entry) => entry.id === args.proposalId);
  if (!proposal) {
    throw new Error("Trade proposal not found.");
  }

  if (![proposal.offererId, proposal.receiverId].includes(args.actor.id)) {
    throw new Error("You are not part of this trade.");
  }

  const timestamp = new Date().toISOString();
  const recipientId =
    args.actor.id === proposal.offererId ? proposal.receiverId : proposal.offererId;
  const message: TradeMessage = {
    id: `message-${Date.now().toString(36)}`,
    proposalId: proposal.id,
    senderId: args.actor.id,
    recipientId,
    body: args.body,
    createdAt: timestamp,
    readAt: null,
  };

  store.tradeMessages.push(message);
  proposal.lastMessageAt = timestamp;
  proposal.updatedAt = timestamp;
  await upsertDoc("tradeMessages", message);
  await upsertDoc("tradeProposals", proposal);
  await createNotification({
    id: `notif-${Date.now().toString(36)}`,
    userId: recipientId,
    type: "message",
    title: "New trade message",
    body: `${args.actor.displayName}: ${args.body.slice(0, 80)}`,
    link: `/trades/${proposal.id}`,
    read: false,
    createdAt: timestamp,
  });

  return message;
}

export async function createReview(args: {
  actor: AuthenticatedRequestUser;
  tradeId: string;
  toUserId: string;
  rating: Review["rating"];
  note: string;
}) {
  const store = await getWritableStore();
  const timestamp = new Date().toISOString();
  const review: Review = {
    id: `review-${Date.now().toString(36)}`,
    fromUserId: args.actor.id,
    toUserId: args.toUserId,
    tradeId: args.tradeId,
    rating: args.rating,
    note: args.note,
    createdAt: timestamp,
  };

  store.reviews.unshift(review);
  await upsertDoc("reviews", review);
  await createNotification({
    id: `notif-${Date.now().toString(36)}`,
    userId: args.toUserId,
    type: "review",
    title: "New review added",
    body: `${args.actor.displayName} left feedback after your trade.`,
    link: `/profile/${args.toUserId}`,
    read: false,
    createdAt: timestamp,
  });

  return review;
}

export async function markDeliveryRequested(tradeId: string) {
  const store = await getWritableStore();
  const proposal = store.tradeProposals.find((entry) => entry.id === tradeId);
  if (!proposal) {
    return null;
  }

  proposal.deliveryRequested = true;
  proposal.updatedAt = new Date().toISOString();
  await upsertDoc("tradeProposals", proposal);
  return proposal;
}
