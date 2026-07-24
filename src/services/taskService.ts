import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { NewTask } from "../types/task";


export async function createTask(newTask: NewTask) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado.");
  }

}