export interface Notification {
  id?: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  type: 'interest' | 'message' | 'favorite' | 'admin_alert';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}
