import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYUBdWF2OZkyJcYj4_JuGD5GlMC_HfFaA",
    authDomain: "health-care-5a156.firebaseapp.com",
    projectId: "health-care-5a156",
    storageBucket: "health-care-5a156.firebasestorage.app",
    messagingSenderId: "804037785147",
    appId: "1:804037785147:web:6b6bf4a8869687d1e7ce1e",
    measurementId: "G-85X78VV6LR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };
