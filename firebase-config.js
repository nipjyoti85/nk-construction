// ============================================================
// firebase-config.js — NK Construction & Infrastructure
// Replace the placeholder values below with your actual
// Firebase project credentials from:
// https://console.firebase.google.com → Project Settings → General → Your Apps
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyBs4ocLa_vAgd4s7aUCiHr2Iv3WkAo96Jg",
  authDomain:        "nk-construction-2d686.firebaseapp.com",
  projectId:         "nk-construction-2d686",
  storageBucket:     "nk-construction-2d686.firebasestorage.app",
  messagingSenderId: "627969337499",
  appId:             "1:627969337499:web:ecc9d8e283ec0500d73e3e",
  measurementId:     "G-G05FQT2BEH"
};

// ── Initialize Firebase ──────────────────────────────────────
firebase.initializeApp(firebaseConfig);

// ── Export shared instances ──────────────────────────────────
const db      = firebase.firestore();
const storage = firebase.storage();
