import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// optional (only if needed)
// import { getAnalytics } from "firebase/analytics";

// config
const firebaseConfig = {
  apiKey: "AIzaSyBn4wdqEAB-aANhttZaF_KKelSX1m4XmQM",
  authDomain: "agrofundbd-official.firebaseapp.com",
  projectId: "agrofundbd-official",
  storageBucket: "agrofundbd-official.firebasestorage.app",
  messagingSenderId: "691440203282",
  appId: "1:691440203282:web:b820bb91e705cd44aacacb",
  measurementId: "G-5P6X0Y5PQ8"
};

// initialize app
const app = initializeApp(firebaseConfig);

// auth export
export const auth = getAuth(app);

// optional analytics (Vite হলে অনেক সময় error দেয়)
// const analytics = getAnalytics(app);

export default app;