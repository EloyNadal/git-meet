const { initializeApp, applicationDefault, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./firebase-keys.json");

const app = !getApps().length && initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();
