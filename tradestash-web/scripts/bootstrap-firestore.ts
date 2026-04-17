import "dotenv/config";

import { getDemoStore, resetDemoStore } from "@/lib/demo-store";
import { getAdminDb } from "@/lib/firebase/admin";
import { toSlug } from "@/lib/utils";

async function clearCollection(collectionName: string) {
  const db = getAdminDb();
  if (!db) {
    return;
  }

  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) {
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function seed() {
  const db = getAdminDb();
  if (!db) {
    throw new Error(
      "Firebase Admin env vars are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY first.",
    );
  }

  const shouldClear = process.argv.includes("--clear");
  const store = resetDemoStore() ?? getDemoStore();
  const collections = [
    "users",
    "listings",
    "tradeProposals",
    "tradeMessages",
    "leaderboards",
    "reviews",
    "notifications",
  ] as const;

  if (shouldClear) {
    for (const collection of collections) {
      await clearCollection(collection);
    }
  }

  const batch = db.batch();

  for (const user of store.users) {
    batch.set(db.collection("users").doc(user.id), user, { merge: true });
  }

  for (const listing of store.listings) {
    batch.set(db.collection("listings").doc(listing.id), listing, { merge: true });
  }

  for (const proposal of store.tradeProposals) {
    batch.set(
      db.collection("tradeProposals").doc(proposal.id),
      proposal,
      { merge: true },
    );
  }

  for (const message of store.tradeMessages) {
    batch.set(db.collection("tradeMessages").doc(message.id), message, { merge: true });
  }

  for (const leaderboard of store.leaderboards) {
    batch.set(
      db.collection("leaderboards").doc(toSlug(leaderboard.city)),
      leaderboard,
      { merge: true },
    );
  }

  for (const review of store.reviews) {
    batch.set(db.collection("reviews").doc(review.id), review, { merge: true });
  }

  for (const notification of store.notifications) {
    batch.set(
      db.collection("notifications").doc(notification.id),
      notification,
      { merge: true },
    );
  }

  await batch.commit();
  console.log("Firestore bootstrapped with TradeStash starter documents.");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
