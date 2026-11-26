import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

// Every vehicle Firestore call lives here; screens never import firebase/firestore.
// Path: users/{uid}/vehicles/{vehicleId}

const vehiclesCol = (uid) => collection(db, 'users', uid, 'vehicles');
const vehicleDoc = (uid, id) => doc(db, 'users', uid, 'vehicles', id);

// Firestore Timestamp → JS Date, so screens only ever see Date objects.
// `?.` twice: the field may be missing/null, and a pending serverTimestamp() has no toDate yet.
const toDate = (ts) => ts?.toDate?.() ?? null;

const mapVehicle = (snap) => {
  const d = snap.data();
  return {
    id: snap.id,
    ...d,
    nextServiceDate: toDate(d.nextServiceDate),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
};

// GET all: newest first.
export async function listVehicles(uid) {
  const snap = await getDocs(query(vehiclesCol(uid), orderBy('createdAt', 'desc')));
  return snap.docs.map(mapVehicle);
}

// GET one: null if it doesn't exist (e.g. deleted on another device), so the screen can show "not found".
export async function getVehicle(uid, id) {
  const snap = await getDoc(vehicleDoc(uid, id));
  return snap.exists() ? mapVehicle(snap) : null;
}

// POST: returns the new id (Phase 7 uses it for the photo).
// photoUrl goes before ...data as a default; the reminder fields and timestamps go after,
// so the form can never overwrite them.
export async function createVehicle(uid, data) {
  const ref = await addDoc(vehiclesCol(uid), {
    photoUrl: null,
    ...data,
    nextServiceDate: null,
    nextServiceMileage: null,
    nextServiceRecordId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// PUT: only the fields passed in change; updatedAt is always refreshed.
export async function updateVehicle(uid, id, data) {
  await updateDoc(vehicleDoc(uid, id), { ...data, updatedAt: serverTimestamp() });
}
