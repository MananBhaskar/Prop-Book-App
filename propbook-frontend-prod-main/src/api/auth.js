/**
 * Firebase Auth helpers for PropBook.
 *
 * Replaces the old HTTP Basic Auth flow (axiosClient.js).
 */

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

/**
 * Sign in with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
    return signOut(auth);
}

/**
 * Subscribe to auth-state changes.
 * @param {(user: import("firebase/auth").User | null) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get the currently signed-in user (or null).
 * @returns {import("firebase/auth").User | null}
 */
export function getCurrentUser() {
    return auth.currentUser;
}
