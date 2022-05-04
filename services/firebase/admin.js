const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = process.env.PRIVATE_FIREBASE_KEYS;

const app = !getApps().length && initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();
