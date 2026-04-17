import type {
  campusTargets,
  leaderboardCities,
  listingCategories,
  listingConditions,
  tierOrder,
} from "@/lib/constants";

export type ListingCategory = (typeof listingCategories)[number];
export type ListingCondition = (typeof listingConditions)[number];
export type TierName = (typeof tierOrder)[number];
export type CampusName = (typeof campusTargets)[number];
export type LeaderboardCity = (typeof leaderboardCities)[number];

export type ListingStatus = "active" | "pending" | "traded";
export type TradeStatus = "pending" | "accepted" | "rejected" | "completed";
export type ReviewRating = "thumbUp" | "thumbDown";
export type VerifiedBadgeStatus = "none" | "pending" | "verified";
export type NotificationType =
  | "proposal"
  | "message"
  | "trade"
  | "boost"
  | "review";

export interface ItemLocation {
  city: string;
  zipCode?: string;
  campus?: string;
  lat?: number;
  lng?: number;
}

export interface TradeStashUser {
  id: string;
  displayName: string;
  email: string;
  city: string;
  campus?: string;
  region: string;
  xp: number;
  tier: TierName;
  streakDays: number;
  lastTradeDate?: string | null;
  lastActiveAt?: string | null;
  verifiedBadge: VerifiedBadgeStatus;
  photoURL?: string;
  bio?: string;
  completedTrades: number;
  pendingTrades: number;
  cosmeticTheme?: string;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  photos: string[];
  location: ItemLocation;
  wantInReturnMode: "text" | "category";
  wantInReturnText?: string;
  wantInReturnCategory?: ListingCategory;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  boostExpiry?: string | null;
  searchKeywords: string[];
}

export interface TradeProposal {
  id: string;
  offererId: string;
  receiverId: string;
  offeredListingId: string;
  requestedListingId: string;
  status: TradeStatus;
  createdAt: string;
  updatedAt: string;
  deliveryRequested: boolean;
  lastMessageAt?: string | null;
}

export interface TradeMessage {
  id: string;
  proposalId: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  tradeId: string;
  rating: ReviewRating;
  note: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  city: string;
  campus?: string;
  xp: number;
  tier: TierName;
  verifiedBadge: boolean;
  completedTrades: number;
  streakDays: number;
}

export interface Leaderboard {
  city: string;
  monthKey: string;
  generatedAt: string;
  topUsers: LeaderboardEntry[];
  hallOfFame: string[];
}

export interface ListingWithOwner extends Listing {
  owner?: TradeStashUser;
  isLegendBoost?: boolean;
}

export interface TradeProposalWithContext extends TradeProposal {
  offerer?: TradeStashUser;
  receiver?: TradeStashUser;
  offeredListing?: Listing;
  requestedListing?: Listing;
  messages?: TradeMessage[];
}

export interface UserDashboard {
  user: TradeStashUser;
  activeListings: ListingWithOwner[];
  proposals: TradeProposalWithContext[];
  notifications: Notification[];
  reviews: Review[];
}

export interface AppSnapshot {
  users: TradeStashUser[];
  listings: Listing[];
  tradeProposals: TradeProposal[];
  tradeMessages: TradeMessage[];
  leaderboards: Leaderboard[];
  reviews: Review[];
  notifications: Notification[];
}
