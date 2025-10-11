import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth as AuthFire } from '@angular/fire/auth';
import { Query } from '../../core/services/query/query';
import { UserMatch } from '../../../domain/model/match.model';
import { User } from '../../../domain/model/user.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  standalone: false,
})
export class MatchesPage implements OnInit {
  public matches: UserMatch[] = [];
  public isLoading: boolean = true;

  constructor(
    private readonly authFire: AuthFire,
    private readonly querySvc: Query,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    await this.loadMatches();
  }

  private async loadMatches() {
    this.isLoading = true;
    const currentUid = this.authFire.currentUser?.uid;

    if (!currentUid) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Obtener todos los likes del usuario actual
      const myLikes = await this.querySvc.listByField('likes', 'userId', currentUid);
      console.log('Mis likes:', myLikes);

      // Obtener todos los usuarios
      const allUsers = await this.querySvc.listAll('users');

      // Filtrar usuarios que también dieron like (match mutuo)
      const matchedUsers: UserMatch[] = [];

      for (const like of myLikes) {
        const likeData = like as any;
        const matchedUserId = likeData.matchedUserId;
        
        if (likeData.action !== 'like') continue; // Solo procesar likes, no passes
        
        // Verificar si el otro usuario también dio like
        const theirLikes = await this.querySvc.listByField('likes', 'userId', matchedUserId);
        const isMatch = theirLikes.some((l: any) => l.matchedUserId === currentUid && l.action === 'like');

        if (isMatch) {
          // Buscar info del usuario
          const user = allUsers.find((u: any) => u.uid === matchedUserId);
          if (user) {
            const userData = user as any;
            matchedUsers.push({
              uid: userData.uid,
              name: userData.name,
              photo: userData.photos?.[0] || '',
              lastMessage: '',
              unreadCount: 0
            });
          }
        }
      }

      this.matches = matchedUsers;
      console.log('Matches encontrados:', this.matches);

    } catch (error) {
      console.error('Error al cargar matches:', error);
    } finally {
      this.isLoading = false;
    }
  }

  public openChat(match: UserMatch) {
    this.router.navigate(['/chat', match.uid]);
  }
}
