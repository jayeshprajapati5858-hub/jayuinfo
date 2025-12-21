import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZKzCvfIoPfYa0s7On96Aip3yu43SoZ1U",
  authDomain: "jayuinfo-fcc46.firebaseapp.com",
  projectId: "jayuinfo-fcc46",
  storageBucket: "jayuinfo-fcc46.firebasestorage.app",
  messagingSenderId: "865389066090",
  appId: "1:865389066090:web:4127315650f0f4d47e5713",
  measurementId: "G-BLCMRRTMPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (Used for Notice Board)
export const db = getFirestore(app);

// Initialize Analytics (Optional)
const analytics = getAnalytics(app);