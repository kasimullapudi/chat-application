// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8lu5CWGleSVMUIpHLLr2kM_3AoTqQSoU",
  authDomain: "real-time-chat-app-69fc6.firebaseapp.com",
  projectId: "real-time-chat-app-69fc6",
  storageBucket: "real-time-chat-app-69fc6.appspot.com",
  messagingSenderId: "284867190686",
  appId: "1:284867190686:web:a35573caf0a348fdcd808f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const provider= new GoogleAuthProvider();
export const db= getFirestore(app);