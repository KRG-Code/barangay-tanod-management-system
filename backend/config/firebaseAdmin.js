// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./barangay-tanod-ms-firebase-adminsdk-b6j9o-359a5ccdb0.json'); // Adjust the path

// Initialize Firebase only if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

module.exports = { bucket };
