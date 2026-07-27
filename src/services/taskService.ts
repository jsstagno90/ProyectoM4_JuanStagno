import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import type { NewTask, Task } from "../types/task";


export async function createTask(newTask: NewTask) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado.");
  }
  await addDoc(collection(db, "tasks"), {
    title: newTask.title,
    description: newTask.description,
    completed: false,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });

}

export async function getTasks(): Promise<Task[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado.");
  }

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Task, "id">),
  }));
}