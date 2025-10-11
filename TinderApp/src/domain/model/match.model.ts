export interface Match {
  id?: string;
  userId: string;
  matchedUserId: string;
  timestamp: Date;
  chatId?: string;
}

export interface UserMatch {
  uid: string;
  name: string;
  photo: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}
