import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Notification } from '@/types/notification';

export const sendNotification = async (data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...data,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
};
