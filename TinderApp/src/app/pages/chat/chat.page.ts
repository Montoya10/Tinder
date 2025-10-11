import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Auth as AuthFire } from '@angular/fire/auth';
import { Query } from '../../core/services/query/query';
import { Message } from '../../../domain/model/message.model';
import { User } from '../../../domain/model/user.model';
import { collection, query, where, orderBy, onSnapshot, Firestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;

  public messages: Message[] = [];
  public newMessage: string = '';
  public matchedUser?: User;
  public currentUserId: string = '';
  public chatId: string = '';
  public isLoading: boolean = true;

  private messagesSubscription?: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authFire: AuthFire,
    private readonly querySvc: Query,
    private readonly firestore: Firestore
  ) {}

  async ngOnInit() {
    const matchedUserId = this.route.snapshot.paramMap.get('uid');
    this.currentUserId = this.authFire.currentUser?.uid || '';

    if (!matchedUserId || !this.currentUserId) {
      this.router.navigate(['/matches']);
      return;
    }

    // Generar chatId único (ordenar UIDs alfabéticamente para consistencia)
    const ids = [this.currentUserId, matchedUserId].sort();
    this.chatId = `${ids[0]}_${ids[1]}`;

    await this.loadMatchedUser(matchedUserId);
    this.subscribeToMessages();
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription();
    }
  }

  private async loadMatchedUser(uid: string) {
    try {
      this.matchedUser = await this.querySvc.get('users', uid) as User;
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private subscribeToMessages() {
    const messagesRef = collection(this.firestore, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', this.chatId)
    );

    this.messagesSubscription = onSnapshot(q, (snapshot) => {
      // Ordenar manualmente en el cliente
      this.messages = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message))
        .sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
          return timeA - timeB;
        });

      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  }

  public async sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      chatId: this.chatId,
      senderId: this.currentUserId,
      receiverId: this.matchedUser!.uid,
      text: this.newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    try {
      await this.querySvc.add('messages', message);
      this.newMessage = '';
      this.scrollToBottom();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }

  public isMyMessage(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  private scrollToBottom() {
    this.content?.scrollToBottom(300);
  }
}
