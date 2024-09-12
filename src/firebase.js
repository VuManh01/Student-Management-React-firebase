import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgxWEBf3i8jhi1BuKyDlixKKSE3yiqSic",
  authDomain: "crudversion2-440ee.firebaseapp.com",
  projectId: "crudversion2-440ee",
  storageBucket: "crudversion2-440ee.appspot.com",
  messagingSenderId: "870962982630",
  appId: "1:870962982630:web:991558f4e784887a7f1527",
};
const app = firebase.initializeApp(firebaseConfig);

// Tạo instance Firestore đúng cách
export const db = firebase.firestore();
