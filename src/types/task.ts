import { Timestamp } from "firebase/firestore";

export interface NewTask {
  title: string;
  description: string;
}

export interface Task extends NewTask {
  id: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
}