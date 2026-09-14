import { getAuth, type Auth } from "firebase/auth";
import { app } from "./config";

// Keep Auth in its own module so public pages that only read Firestore do not
// create Firebase's hidden authentication iframe.
export const auth: Auth | null = app ? getAuth(app) : null;
