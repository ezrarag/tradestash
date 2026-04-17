"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseClientConfig, hasFirebaseClientEnv } from "@/lib/env";

export function getFirebaseClientApp() {
  if (!hasFirebaseClientEnv || !firebaseClientConfig) {
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseClientConfig);
}

export function getFirebaseAuth() {
  const app = getFirebaseClientApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseDb() {
  const app = getFirebaseClientApp();
  return app ? getFirestore(app) : null;
}
