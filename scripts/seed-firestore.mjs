// TradeStash — Firestore Seed Script
// -----------------------------------------------
// Run this ONCE after setting up your Firebase project.
// It creates all the collections, config, and placeholder docs.
//
// HOW TO RUN:
//   1. Make sure .env.local exists with your Firebase keys
//   2. In terminal, from the root of this repo:
//        node scripts/seed-firestore.mjs
// -----------------------------------------------

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually (dotenv ESM workaround)
const envPath = resolve(process.cwd(), '.env.local')
const envFile = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim().replace(/^"|"$/g, '')]
    })
)

const projectId = env.FIREBASE_PROJECT_ID
const clientEmail = env.FIREBASE_CLIENT_EMAIL
const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in .env.local')
  console.error('   These are the SERVER-SIDE admin keys (not the NEXT_PUBLIC_ ones).')
  console.error('   Get them from: Firebase Console → Project Settings → Service Accounts → Generate new private key')
  process.exit(1)
}

initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
})

const db = getFirestore()

async function seed() {
  console.log('\n🌱 Seeding TradeStash Firestore...\n')

  // ── App Config ──────────────────────────────────────────────────
  await db.doc('config/tradestash').set({
    tiers: {
      scout:   { min: 0,    max: 99,   label: 'Scout',   perks: [] },
      tracker: { min: 100,  max: 299,  label: 'Tracker', perks: [] },
      trader:  { min: 300,  max: 699,  label: 'Trader',  perks: ['early_access'] },
      veteran: { min: 700,  max: 1499, label: 'Veteran', perks: ['early_access', 'cosmetic_border'] },
      legend:  { min: 1500, max: null, label: 'Legend',  perks: ['early_access', 'cosmetic_border', 'auto_boost'] },
    },
    xpEvents: {
      tradeCompleted:     50,
      proximityUnder5mi:  10,
      proximityUnder20mi:  5,
      firstTradeOfWeek:   15,
      dailyStreak:         5,
    },
    xpDecay: {
      daysBeforeDecay: 6,
      decayPerDay: 10,
      floor: 0,
    },
    categories: [
      'Electronics', 'Clothing', 'Books', 'Furniture',
      'Games', 'Sports', 'Collectibles', 'Other',
    ],
    leaderboardResetDay: 1, // 1st of each month
    updatedAt: Timestamp.now(),
  })
  console.log('✅ config/tradestash — XP rules, tiers, categories')

  // ── Placeholder Listing ──────────────────────────────────────────
  await db.collection('listings').doc('_placeholder').set({
    userId: '_system',
    title: 'Schema placeholder — safe to delete',
    description: '',
    category: 'Other',
    condition: 'good',
    photos: [],
    location: { city: '', state: '', lat: 0, lng: 0 },
    wantInReturn: '',
    status: 'inactive',
    boostExpiry: null,
    createdAt: Timestamp.now(),
  })
  console.log('✅ listings/_placeholder')

  // ── Placeholder Trade Proposal ───────────────────────────────────
  await db.collection('tradeProposals').doc('_placeholder').set({
    offererId: '_system',
    receiverId: '_system',
    offeredListingId: '_placeholder',
    requestedListingId: '_placeholder',
    status: 'inactive',
    messages: [],
    createdAt: Timestamp.now(),
  })
  console.log('✅ tradeProposals/_placeholder')

  // ── Placeholder Review ───────────────────────────────────────────
  await db.collection('reviews').doc('_placeholder').set({
    fromUserId: '_system',
    toUserId: '_system',
    tradeId: '_placeholder',
    rating: 'thumbUp',
    note: '',
    createdAt: Timestamp.now(),
  })
  console.log('✅ reviews/_placeholder')

  // ── Leaderboards — DMV Launch Cities ────────────────────────────
  const cities = [
    { id: 'washington-dc',  city: 'Washington DC',  state: 'DC' },
    { id: 'baltimore-md',   city: 'Baltimore',       state: 'MD' },
    { id: 'richmond-va',    city: 'Richmond',        state: 'VA' },
    { id: 'college-park-md',city: 'College Park',    state: 'MD' },
    { id: 'morgantown-wv',  city: 'Morgantown',      state: 'WV' },
  ]
  for (const entry of cities) {
    await db.collection('leaderboards').doc(entry.id).set({
      city: entry.city,
      state: entry.state,
      region: 'dmv',
      topUsers: [],
      updatedAt: Timestamp.now(),
    })
    console.log(`✅ leaderboards/${entry.id}`)
  }

  // ── Admin/Test User ──────────────────────────────────────────────
  // IMPORTANT: Replace YOUR_UID_HERE with your actual Firebase Auth UID
  // Find it at: Firebase Console → Authentication → Users → copy UID column
  const ADMIN_UID = 'YOUR_UID_HERE'
  const ADMIN_EMAIL = 'your@email.com' // replace with your actual email

  if (ADMIN_UID === 'YOUR_UID_HERE') {
    console.log('\n⚠️  Skipping admin user — update ADMIN_UID in this script first.')
    console.log('   Find your UID at: Firebase Console → Authentication → Users')
  } else {
    await db.collection('users').doc(ADMIN_UID).set({
      displayName: 'Admin',
      email: ADMIN_EMAIL,
      city: '',
      xp: 0,
      tier: 'scout',
      streakDays: 0,
      lastTradeDate: null,
      verifiedBadge: true,
      photoURL: null,
      role: 'admin',
      createdAt: Timestamp.now(),
    })
    console.log(`✅ users/${ADMIN_UID} — admin user`)
  }

  console.log('\n🎯 Seed complete!')
  console.log('   Next: Open Firebase Console → Firestore to confirm collections appeared.')
  console.log('   Then: Update ADMIN_UID in this script and run again to create your admin user.\n')
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
