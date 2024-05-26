// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCZS7MKexwESCjAYbcmKDAl8NzxTC7w1vk",
  authDomain: "fitness-app-90bbf.firebaseapp.com",
  databaseURL: "https://fitness-app-90bbf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fitness-app-90bbf",
  storageBucket: "fitness-app-90bbf.appspot.com",
  messagingSenderId: "422609442148",
  appId: "1:422609442148:web:0f6f37df783a4962649671"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);