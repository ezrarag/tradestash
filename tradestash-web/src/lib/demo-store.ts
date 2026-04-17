import { getTierFromXp } from "@/lib/xp";
import type {
  AppSnapshot,
  Leaderboard,
  Listing,
  Notification,
  Review,
  TradeMessage,
  TradeProposal,
  TradeStashUser,
} from "@/lib/types";

const users: TradeStashUser[] = [
  {
    id: "demo-maya",
    displayName: "Maya Brooks",
    email: "maya@tradestash.demo",
    city: "Washington, DC",
    campus: "Howard University",
    region: "DMV",
    xp: 1620,
    tier: "Legend",
    streakDays: 6,
    lastTradeDate: "2026-04-13T16:10:00.000Z",
    lastActiveAt: "2026-04-14T08:15:00.000Z",
    verifiedBadge: "verified",
    photoURL:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Howard alum energy. Dorm tech flips, sneaker trades, zero landfill guilt.",
    completedTrades: 26,
    pendingTrades: 2,
    cosmeticTheme: "Legend Neon",
  },
  {
    id: "demo-jalen",
    displayName: "Jalen Rivers",
    email: "jalen@tradestash.demo",
    city: "Baltimore, MD",
    campus: "Morgan State University",
    region: "Mid-Atlantic",
    xp: 840,
    tier: "Veteran",
    streakDays: 4,
    lastTradeDate: "2026-04-12T19:20:00.000Z",
    lastActiveAt: "2026-04-14T06:45:00.000Z",
    verifiedBadge: "none",
    photoURL:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Always trading dorm gear, games, and camera accessories.",
    completedTrades: 14,
    pendingTrades: 1,
    cosmeticTheme: "Street Grid",
  },
  {
    id: "demo-zoe",
    displayName: "Zoe Patel",
    email: "zoe@tradestash.demo",
    city: "College Park, MD",
    campus: "University of Maryland",
    region: "DMV",
    xp: 320,
    tier: "Trader",
    streakDays: 2,
    lastTradeDate: "2026-04-10T18:00:00.000Z",
    lastActiveAt: "2026-04-13T20:30:00.000Z",
    verifiedBadge: "pending",
    photoURL:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80",
    bio: "Books, furniture, and bike gear. Will trade for anything practical.",
    completedTrades: 7,
    pendingTrades: 3,
  },
  {
    id: "demo-omar",
    displayName: "Omar Hayes",
    email: "omar@tradestash.demo",
    city: "Richmond, VA",
    campus: "Virginia Commonwealth University",
    region: "Mid-Atlantic",
    xp: 130,
    tier: "Tracker",
    streakDays: 1,
    lastTradeDate: "2026-04-08T21:00:00.000Z",
    lastActiveAt: "2026-04-11T11:00:00.000Z",
    verifiedBadge: "none",
    photoURL:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Skateboards, speakers, and late-night side quests.",
    completedTrades: 3,
    pendingTrades: 1,
  },
];

const listings: Listing[] = [
  {
    id: "listing-ipad-air",
    userId: "demo-maya",
    title: "iPad Air with Apple Pencil sleeve",
    description:
      "Clean iPad Air setup for note-taking and design classes. Looking to swap for camera gear or a gaming handheld.",
    category: "Electronics",
    condition: "Like New",
    photos: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    ],
    location: {
      city: "Washington, DC",
      zipCode: "20059",
      campus: "Howard University",
      lat: 38.9227,
      lng: -77.0194,
    },
    wantInReturnMode: "text",
    wantInReturnText: "Sony camera lens, Nintendo Switch Lite, or premium dorm audio",
    status: "active",
    createdAt: "2026-04-14T07:00:00.000Z",
    updatedAt: "2026-04-14T07:00:00.000Z",
    boostExpiry: "2026-04-15T07:00:00.000Z",
    searchKeywords: ["ipad", "tablet", "pencil", "electronics", "design"],
  },
  {
    id: "listing-sneaker-crate",
    userId: "demo-jalen",
    title: "Sneaker display crate and UV light strip",
    description:
      "Perfect for dorm sneakerheads. Clean acrylic crate set with magnetic doors and a plug-in light strip.",
    category: "Collectibles",
    condition: "Good",
    photos: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    ],
    location: {
      city: "Baltimore, MD",
      zipCode: "21251",
      campus: "Morgan State University",
      lat: 39.3443,
      lng: -76.5844,
    },
    wantInReturnMode: "category",
    wantInReturnCategory: "Furniture",
    status: "active",
    createdAt: "2026-04-13T23:30:00.000Z",
    updatedAt: "2026-04-13T23:30:00.000Z",
    boostExpiry: null,
    searchKeywords: ["sneaker", "crate", "display", "collectibles", "storage"],
  },
  {
    id: "listing-mini-fridge",
    userId: "demo-zoe",
    title: "Mini fridge with freezer shelf",
    description:
      "Compact dorm fridge that still fits meal prep. Looking for books, gym gear, or a desk chair upgrade.",
    category: "Furniture",
    condition: "Good",
    photos: [
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80",
    ],
    location: {
      city: "College Park, MD",
      zipCode: "20742",
      campus: "University of Maryland",
      lat: 38.9869,
      lng: -76.9426,
    },
    wantInReturnMode: "text",
    wantInReturnText: "Adjustable desk chair or hardcover fantasy set",
    status: "active",
    createdAt: "2026-04-12T17:15:00.000Z",
    updatedAt: "2026-04-12T17:15:00.000Z",
    boostExpiry: null,
    searchKeywords: ["fridge", "dorm", "furniture", "freezer", "college"],
  },
  {
    id: "listing-calculus-bundle",
    userId: "demo-omar",
    title: "Calculus II book bundle + graphing calculator",
    description:
      "Textbook, study guide, and TI calculator together. Looking for headphones or retro games.",
    category: "Books",
    condition: "Fair",
    photos: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    ],
    location: {
      city: "Richmond, VA",
      zipCode: "23284",
      campus: "Virginia Commonwealth University",
      lat: 37.5482,
      lng: -77.4522,
    },
    wantInReturnMode: "category",
    wantInReturnCategory: "Electronics",
    status: "active",
    createdAt: "2026-04-11T20:05:00.000Z",
    updatedAt: "2026-04-11T20:05:00.000Z",
    boostExpiry: null,
    searchKeywords: ["calculus", "book", "textbook", "calculator", "electronics"],
  },
  {
    id: "listing-switch-games",
    userId: "demo-maya",
    title: "Switch game bundle: Mario Kart + Smash",
    description:
      "Physical copies in great condition. Looking for dorm decor, headphones, or a polaroid camera.",
    category: "Games",
    condition: "Like New",
    photos: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
    ],
    location: {
      city: "Washington, DC",
      zipCode: "20059",
      campus: "Howard University",
      lat: 38.9227,
      lng: -77.0194,
    },
    wantInReturnMode: "text",
    wantInReturnText: "Noise-canceling headphones or film camera",
    status: "active",
    createdAt: "2026-04-10T10:00:00.000Z",
    updatedAt: "2026-04-10T10:00:00.000Z",
    boostExpiry: null,
    searchKeywords: ["switch", "games", "mario", "smash", "gaming"],
  },
];

const tradeProposals: TradeProposal[] = [
  {
    id: "proposal-1",
    offererId: "demo-jalen",
    receiverId: "demo-maya",
    offeredListingId: "listing-sneaker-crate",
    requestedListingId: "listing-ipad-air",
    status: "pending",
    createdAt: "2026-04-14T08:00:00.000Z",
    updatedAt: "2026-04-14T08:00:00.000Z",
    deliveryRequested: false,
    lastMessageAt: "2026-04-14T08:04:00.000Z",
  },
  {
    id: "proposal-2",
    offererId: "demo-zoe",
    receiverId: "demo-omar",
    offeredListingId: "listing-mini-fridge",
    requestedListingId: "listing-calculus-bundle",
    status: "accepted",
    createdAt: "2026-04-13T17:00:00.000Z",
    updatedAt: "2026-04-13T19:30:00.000Z",
    deliveryRequested: true,
    lastMessageAt: "2026-04-13T19:31:00.000Z",
  },
];

const tradeMessages: TradeMessage[] = [
  {
    id: "message-1",
    proposalId: "proposal-1",
    senderId: "demo-jalen",
    recipientId: "demo-maya",
    body: "Would you swap the iPad for the sneaker crate plus a portable ring light?",
    createdAt: "2026-04-14T08:00:00.000Z",
    readAt: "2026-04-14T08:12:00.000Z",
  },
  {
    id: "message-2",
    proposalId: "proposal-1",
    senderId: "demo-maya",
    recipientId: "demo-jalen",
    body: "Tempting. If you can meet around U Street this week I’m interested.",
    createdAt: "2026-04-14T08:04:00.000Z",
    readAt: null,
  },
  {
    id: "message-3",
    proposalId: "proposal-2",
    senderId: "demo-zoe",
    recipientId: "demo-omar",
    body: "Accepted. I’ll use the delivery request so we don’t have to coordinate the drive.",
    createdAt: "2026-04-13T19:31:00.000Z",
    readAt: null,
  },
];

const reviews: Review[] = [
  {
    id: "review-1",
    fromUserId: "demo-jalen",
    toUserId: "demo-maya",
    tradeId: "trade-legend-1",
    rating: "thumbUp",
    note: "Fast meet-up, clear photos, and zero flake energy.",
    createdAt: "2026-04-01T14:00:00.000Z",
  },
  {
    id: "review-2",
    fromUserId: "demo-zoe",
    toUserId: "demo-omar",
    tradeId: "trade-richmond-2",
    rating: "thumbUp",
    note: "Exactly as described and flexible on pickup timing.",
    createdAt: "2026-03-28T13:00:00.000Z",
  },
];

const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "demo-maya",
    type: "proposal",
    title: "New trade offer",
    body: "Jalen offered a sneaker display crate for your iPad Air listing.",
    link: "/trades/proposal-1",
    read: false,
    createdAt: "2026-04-14T08:00:00.000Z",
  },
  {
    id: "notif-2",
    userId: "demo-omar",
    type: "trade",
    title: "Trade accepted",
    body: "Zoe accepted your proposal. Delivery is available now.",
    link: "/trades/proposal-2",
    read: false,
    createdAt: "2026-04-13T19:30:00.000Z",
  },
];

const leaderboards: Leaderboard[] = [
  {
    city: "Washington, DC",
    monthKey: "2026-04",
    generatedAt: "2026-04-14T08:15:00.000Z",
    hallOfFame: ["demo-maya"],
    topUsers: users
      .filter((user) => user.city === "Washington, DC")
      .map((user) => ({
        uid: user.id,
        displayName: user.displayName,
        city: user.city,
        campus: user.campus,
        xp: user.xp,
        tier: user.tier,
        verifiedBadge: user.verifiedBadge === "verified",
        completedTrades: user.completedTrades,
        streakDays: user.streakDays,
      })),
  },
  {
    city: "Baltimore, MD",
    monthKey: "2026-04",
    generatedAt: "2026-04-14T08:15:00.000Z",
    hallOfFame: [],
    topUsers: users
      .filter((user) => user.city === "Baltimore, MD")
      .map((user) => ({
        uid: user.id,
        displayName: user.displayName,
        city: user.city,
        campus: user.campus,
        xp: user.xp,
        tier: user.tier,
        verifiedBadge: user.verifiedBadge === "verified",
        completedTrades: user.completedTrades,
        streakDays: user.streakDays,
      })),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __tradestashDemoStore: AppSnapshot | undefined;
}

function buildSnapshot(): AppSnapshot {
  return {
    users: structuredClone(users),
    listings: structuredClone(listings),
    tradeProposals: structuredClone(tradeProposals),
    tradeMessages: structuredClone(tradeMessages),
    leaderboards: structuredClone(leaderboards),
    reviews: structuredClone(reviews),
    notifications: structuredClone(notifications),
  };
}

export function getDemoStore() {
  if (!global.__tradestashDemoStore) {
    global.__tradestashDemoStore = buildSnapshot();
  }

  return global.__tradestashDemoStore;
}

export function resetDemoStore() {
  global.__tradestashDemoStore = buildSnapshot();
  return global.__tradestashDemoStore;
}

export function hydrateUserTiers() {
  const store = getDemoStore();
  store.users = store.users.map((user) => ({
    ...user,
    tier: getTierFromXp(user.xp),
  }));
  return store;
}
