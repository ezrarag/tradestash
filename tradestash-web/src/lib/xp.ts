import {
  differenceInCalendarDays,
  differenceInHours,
  isSameWeek,
  parseISO,
} from "date-fns";

import { tierOrder } from "@/lib/constants";
import type {
  ItemLocation,
  TierName,
  TradeStashUser,
} from "@/lib/types";

const tierThresholds: Record<TierName, { min: number; max: number | null }> = {
  Scout: { min: 0, max: 99 },
  Tracker: { min: 100, max: 299 },
  Trader: { min: 300, max: 699 },
  Veteran: { min: 700, max: 1499 },
  Legend: { min: 1500, max: null },
};

export function getTierFromXp(xp: number): TierName {
  const tier = tierOrder.find((name) => {
    const config = tierThresholds[name];
    return xp >= config.min && (config.max === null || xp <= config.max);
  });

  return tier ?? "Scout";
}

export function getNextTierThreshold(xp: number) {
  const currentTier = getTierFromXp(xp);
  const currentIndex = tierOrder.indexOf(currentTier);
  const nextTier = tierOrder[currentIndex + 1];

  if (!nextTier) {
    return null;
  }

  return tierThresholds[nextTier].min;
}

export function getEffectiveXp(user: Pick<TradeStashUser, "xp" | "lastActiveAt">) {
  if (!user.lastActiveAt) {
    return user.xp;
  }

  const inactiveDays = differenceInCalendarDays(new Date(), parseISO(user.lastActiveAt));
  if (inactiveDays <= 6) {
    return user.xp;
  }

  const decayDays = inactiveDays - 6;
  return Math.max(0, user.xp - decayDays * 10);
}

export function calculateTradeStreakBonus(user: Pick<TradeStashUser, "lastTradeDate" | "streakDays">) {
  if (!user.lastTradeDate) {
    return { streakDays: 1, streakXp: 5, weeklyXp: 15 };
  }

  const lastTradeDate = parseISO(user.lastTradeDate);
  const daysSinceTrade = differenceInCalendarDays(new Date(), lastTradeDate);
  const streakDays = daysSinceTrade <= 1 ? Math.min(user.streakDays + 1, 6) : 1;

  return {
    streakDays,
    streakXp: streakDays * 5,
    weeklyXp: isSameWeek(new Date(), lastTradeDate) ? 0 : 15,
  };
}

export function calculateMilesBetween(a?: ItemLocation, b?: ItemLocation) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) {
    return null;
  }

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(haversine));
}

export function calculateProximityBonus(a?: ItemLocation, b?: ItemLocation) {
  const distance = calculateMilesBetween(a, b);

  if (distance === null) {
    return { miles: null, xp: 0 };
  }

  if (distance < 5) {
    return { miles: distance, xp: 10 };
  }

  if (distance < 20) {
    return { miles: distance, xp: 5 };
  }

  return { miles: distance, xp: 0 };
}

export function calculateTradeCompletionXp(args: {
  user: Pick<TradeStashUser, "lastTradeDate" | "streakDays">;
  offerLocation?: ItemLocation;
  requestLocation?: ItemLocation;
}) {
  const streak = calculateTradeStreakBonus(args.user);
  const proximity = calculateProximityBonus(args.offerLocation, args.requestLocation);
  const totalXp = 50 + streak.weeklyXp + streak.streakXp + proximity.xp;

  return {
    awardedXp: totalXp,
    streakDays: streak.streakDays,
    proximityMiles: proximity.miles,
    breakdown: {
      completedTrade: 50,
      weeklyBonus: streak.weeklyXp,
      streakBonus: streak.streakXp,
      proximityBonus: proximity.xp,
    },
  };
}

export function recentlyBoosted(boostExpiry?: string | null) {
  return Boolean(
    boostExpiry &&
      differenceInHours(parseISO(boostExpiry), new Date()) >= 0,
  );
}
