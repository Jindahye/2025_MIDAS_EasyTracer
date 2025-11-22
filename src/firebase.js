import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBAEQ3MiTCpIWrRUKrlCB0XYORqcIakpIc",
  authDomain: "midas-easytracer.firebaseapp.com",
  projectId: "midas-easytracer",
  storageBucket: "midas-easytracer.firebasestorage.app",
  messagingSenderId: "860501239142",
  appId: "1:860501239142:web:37620ad32e964597f314a7"
};

const app = initializeApp(firebaseConfig); 

export const auth = getAuth(app);
export const db = getFirestore(app);