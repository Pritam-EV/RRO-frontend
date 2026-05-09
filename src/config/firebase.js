import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCnN13rJw8VEXsK4awxhDDPk1kk-roAWWA",
  authDomain: "ev-charging-a5c53.firebaseapp.com",
  databaseURL: "https://ev-charging-a5c53-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ev-charging-a5c53",
  storageBucket: "ev-charging-a5c53.appspot.com",
  messagingSenderId: "421525429783",
  appId: "1:421525429783:web:1607b8434297cc921e0652",
  measurementId: "G-DMVEDT6880",
};

const app = initializeApp(firebaseConfig);

// // Enable debug token on localhost
// if (window.location.hostname === "localhost") {
//   window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// }

if (window.location.hostname !== "localhost") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("699552d0-f01f-4eea-afb7-f38489d47923"),
    isTokenAutoRefreshEnabled: true,
  });
}

// // Initialize App Check
// initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("699552d0-f01f-4eea-afb7-f38489d47923"),
//   isTokenAutoRefreshEnabled: true,
// });

export const auth = getAuth(app);
