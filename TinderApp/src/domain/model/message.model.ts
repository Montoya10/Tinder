export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id?: string;
  participants: string[]; // Array de UIDs
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
}
