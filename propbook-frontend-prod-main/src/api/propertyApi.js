/**
 * Property & Activity API — backed by Firebase Firestore.
 *
 * Replaces the old Axios / Spring Boot REST layer.
 */

import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Collection references ──────────────────────────────────────────────────────
const propertiesCol = collection(db, "properties");
const activityCol = collection(db, "activity");

// ─── Properties ────────────────────────────────────────────────────────────────

/**
 * Fetch all properties, newest first.
 * @returns {Promise<Array>}
 */
export async function fetchProperties() {
    const q = query(propertiesCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Create a new property.
 * @param {Object} property
 * @returns {Promise<Object>} Created property with Firestore-assigned ID
 */
export async function createProperty(property) {
    const payload = { ...property, createdAt: serverTimestamp() };
    const docRef = await addDoc(propertiesCol, payload);
    return { id: docRef.id, ...property };
}

/**
 * Update an existing property.
 * @param {string} id
 * @param {Object} property
 * @returns {Promise<Object>} Updated property
 */
export async function updateProperty(id, property) {
    const ref = doc(db, "properties", id);
    // Remove id from the payload — Firestore stores it as the doc key
    const { id: _id, ...data } = property;
    await updateDoc(ref, data);
    return { id, ...data };
}

/**
 * Delete a property.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteProperty(id) {
    await deleteDoc(doc(db, "properties", id));
}

// ─── Activity Log ──────────────────────────────────────────────────────────────

/**
 * Fetch all activity log entries, newest first.
 * @returns {Promise<Array>}
 */
export async function fetchActivity() {
    const q = query(activityCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Post a single activity log entry.
 * @param {Object} entry - { user, msg, time }
 * @returns {Promise<Object>}
 */
export async function postActivity(entry) {
    const payload = { ...entry, createdAt: serverTimestamp() };
    const docRef = await addDoc(activityCol, payload);
    return { id: docRef.id, ...entry };
}
