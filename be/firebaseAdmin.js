import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.warn("[Firebase Admin] Missing credentials — Google login will not work.");
  console.warn("  FIREBASE_PROJECT_ID:", projectId ? "set" : "MISSING");
  console.warn("  FIREBASE_CLIENT_EMAIL:", clientEmail ? "set" : "MISSING");
  console.warn("  FIREBASE_PRIVATE_KEY:", privateKey ? "set" : "MISSING");
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("[Firebase Admin] Initialized successfully");
  } catch (err) {
    console.error("[Firebase Admin] Init failed:", err.message);
  }
}

export default admin;
