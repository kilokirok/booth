// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsNuRvwC_5362cCOC4c8juth1f1pWeWSM",
  authDomain: "booth-a3a53.firebaseapp.com",
  projectId: "booth-a3a53",
  storageBucket: "booth-a3a53.firebasestorage.app",
  messagingSenderId: "172502386350",
  appId: "1:172502386350:web:1cf61f8bed16fd77000f3f",
  measurementId: "G-302G21S9V0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);