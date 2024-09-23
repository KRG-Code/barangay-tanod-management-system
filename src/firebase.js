// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Optional: Import analytics if needed
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDPCJiTBMMYZZLT6WdyptA9So_JAtFHfjM",
  authDomain: "barangay-tanod-ms.firebaseapp.com",
  projectId: "barangay-tanod-ms",
  storageBucket: "barangay-tanod-ms.appspot.com",
  messagingSenderId: "167323136598",
  appId: "1:167323136598:web:27300ccf6348a7ac8181f7",
  measurementId: "G-NPLESCYB7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app); // Optional

export { storage };
