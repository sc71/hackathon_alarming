// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNRKTrkZuU4KlZT_sxNTyfSAM88dzDyhI",
  authDomain: "hackathon-c0d58.firebaseapp.com",
  projectId: "hackathon-c0d58",
  storageBucket: "hackathon-c0d58.appspot.com",
  messagingSenderId: "1050971774378",
  appId: "1:1050971774378:web:458cace1194e3120a9dfd3"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default firebase;