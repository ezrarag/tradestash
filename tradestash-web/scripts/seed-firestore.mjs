// Run with: node scripts/seed-firestore.mjs

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

function readArgValue(flag) {
  const direct = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (direct) {
    return direct.slice(flag.length + 1);
  }

  const index = process.argv.findIndex((arg) => arg === flag);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  return undefined;
}

async function seed() {
  const now = new Date().toISOString();
  const monthKey = now.slice(0, 7);
  const seedUid =
    readArgValue("--uid") || process.env.FIREBASE_SEED_UID || "REPLACE_WITH_YOUR_UID";

  console.log("Seeding TradeStash Firestore...");

  await db.doc("config/tradestash").set({
    tiers: {
      scout: { min: 0, max: 99, label: "Scout", perks: [] },
      tracker: { min: 100, max: 299, label: "Tracker", perks: [] },
      trader: { min: 300, max: 699, label: "Trader", perks: ["early_access"] },
      veteran: {
        min: 700,
        max: 1499,
        label: "Veteran",
        perks: ["early_access", "cosmetic_border"],
      },
      legend: {
        min: 1500,
        max: null,
        label: "Legend",
        perks: ["early_access", "cosmetic_border", "auto_boost"],
      },
    },
    xpEvents: {
      tradeCompleted: 50,
      proximityUnder5mi: 10,
      proximityUnder20mi: 5,
      firstTradeOfWeek: 15,
      dailyStreak: 5,
    },
    xpDecay: {
      daysBeforeDecay: 6,
      decayPerDay: 10,
      floor: 0,
    },
    categories: [
      "Electronics",
      "Clothing",
      "Books",
      "Furniture",
      "Games",
      "Sports",
      "Collectibles",
      "Other",
    ],
    updatedAt: now,
  });

  console.log("config/tradestash");

  await db.collection("listings").doc("_placeholder").set({
    userId: "_system",
    title: "Schema placeholder - delete this",
    description: "Placeholder record to reserve the listing document shape.",
    category: "Other",
    condition: "Good",
    photos: [],
    location: { city: "System" },
    wantInReturnMode: "text",
    wantInReturnText: "Delete this placeholder once real listings exist.",
    status: "traded",
    boostExpiry: null,
    createdAt: now,
    updatedAt: now,
    searchKeywords: ["placeholder", "schema", "listing"],
  });

  console.log("listings/_placeholder");

  await db.collection("tradeProposals").doc("_placeholder").set({
    offererId: "_system",
    receiverId: "_system",
    offeredListingId: "_placeholder",
    requestedListingId: "_placeholder",
    status: "completed",
    createdAt: now,
    updatedAt: now,
    deliveryRequested: false,
    lastMessageAt: null,
  });

  console.log("tradeProposals/_placeholder");

  await db.collection("leaderboards").doc("washington-dc").set({
    city: "Washington, DC",
    monthKey,
    generatedAt: now,
    topUsers: [],
    hallOfFame: [],
  });

  console.log("leaderboards/washington-dc");

  await db.collection("users").doc(seedUid).set({
    displayName: "Ezra",
    email: "ezra@readyaimgo.biz",
    city: "Milwaukee",
    region: "Midwest",
    xp: 0,
    tier: "Scout",
    streakDays: 0,
    lastTradeDate: null,
    lastActiveAt: now,
    verifiedBadge: "none",
    photoURL: "",
    bio: "Admin seed profile. Replace with your real Firebase Auth UID.",
    completedTrades: 0,
    pendingTrades: 0,
    role: "admin",
    createdAt: now,
  });

  console.log(`users/${seedUid}`);

  if (seedUid === "REPLACE_WITH_YOUR_UID") {
    console.log(
      "\nSeed complete. Re-run with npm run seed:firestore:mjs -- --uid=YOUR_FIREBASE_AUTH_UID",
    );
  } else {
    console.log(`\nSeed complete. Seeded admin user document for UID ${seedUid}.`);
  }
}

seed().catch(console.error);
