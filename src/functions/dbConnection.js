import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore"

 const firebaseConfig = {
  apiKey: "AIzaSyD-4jFbrAC4fABptmnjLkAE5vIupI7swF4",
  authDomain: "emotum-price-manager.firebaseapp.com",
  databaseURL: "https://emotum-price-manager-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "emotum-price-manager",
  storageBucket: "emotum-price-manager.appspot.com",
  messagingSenderId: "67308652791",
  appId: "1:67308652791:web:f4e053201378a242c6ebf2",
  measurementId: "G-7N5VYJ0L57"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);


export const db = getFirestore(app);