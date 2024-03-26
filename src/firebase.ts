// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4Mo1EZ5BfW_d4qsqoIBSYKQSEkCJjZKM",
  authDomain: "dones-6c593.firebaseapp.com",
  projectId: "dones-6c593",
  storageBucket: "dones-6c593.appspot.com",
  messagingSenderId: "948071345739",
  appId: "1:948071345739:web:59f3534123e896dd98a7ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
