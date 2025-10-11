import { Component, OnInit } from '@angular/core';
import { User } from '../../../domain/model/user.model';
import { Auth as AuthFire } from '@angular/fire/auth';
import { Query } from '../../core/services/query/query';
import { Router } from '@angular/router';
import { Auth } from '../../core/providers/auth/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public recommendations: User[] = [];

  constructor(
    private readonly authFire: AuthFire,
    private readonly querySvc: Query,
    private readonly router: Router,
    private readonly authPrv: Auth
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  private async loadRecommendations(){
    try{
      // get current user uid from Firebase auth
      const currentUid = this.authFire.currentUser?.uid || '';
      console.log('🔍 Current User UID:', currentUid);

      // fetch profiles from Firestore usando el servicio Query
      const profiles = await this.querySvc.listAll('users');
      console.log('📦 Users obtenidos de Firestore:', profiles.length);
      console.log('📋 Perfiles:', profiles);

      const users: User[] = profiles as any;

      // filter out current user and compute matches by shared passions
      const filtered = users.filter(u => u.uid !== currentUid && Array.isArray(u.passions));
      console.log('✅ Perfiles filtrados (sin usuario actual):', filtered.length);

      // compute a score (number of shared passions) and sort
      const currentUser = users.find(u => u.uid === currentUid) as User | undefined;
      console.log('👤 Usuario actual encontrado:', currentUser?.name || 'No encontrado');

      if (!currentUser) {
        // if no current user, just show first N users
        console.log('⚠️ No se encontró el usuario actual, mostrando primeros 10 perfiles');
        this.recommendations = filtered.slice(0, 10);
        console.log('🎯 Recomendaciones finales:', this.recommendations.length);
        return;
      }

      console.log('💖 Passions del usuario actual:', currentUser.passions);

      const scored = filtered.map(u => {
        const shared = (u.passions || []).filter((p: any) =>
          (currentUser.passions || []).some((cp: any) => cp.category === p.category)
        );
        console.log(`📊 ${u.name}: ${shared.length} intereses compartidos`, shared.map(s => s.category));
        return { user: u, score: shared.length };
      });

      scored.sort((a,b) => b.score - a.score);

      // Mostrar TODOS los usuarios ordenados por score (incluso si es 0)
      this.recommendations = scored.map(s => s.user).slice(0, 10);

      console.log('🎯 Recomendaciones finales:', this.recommendations.length);

    }catch(err){
      console.error('❌ Error loading recommendations', err);
    }
  }

  public async onLike(uid: string){
    console.log('Like', uid);
    const currentUid = this.authFire.currentUser?.uid;
    
    if (!currentUid) return;

    try {
      // Guardar el like en Firestore
      await this.querySvc.add('likes', {
        userId: currentUid,
        matchedUserId: uid,
        action: 'like',
        timestamp: new Date()
      });

      // Verificar si hay match mutuo
      const theirLikes = await this.querySvc.listByField('likes', 'userId', uid);
      const isMatch = theirLikes.some((l: any) => l.matchedUserId === currentUid);

      if (isMatch) {
        alert('🎉 ¡Es un match! Ahora pueden chatear');
        this.router.navigate(['/matches']);
      } else {
        // Remover usuario de las recomendaciones
        this.recommendations = this.recommendations.filter(u => u.uid !== uid);
      }
    } catch (error) {
      console.error('Error al guardar like:', error);
    }
  }
  
  public async onPass(uid: string){
    console.log('Pass', uid);
    const currentUid = this.authFire.currentUser?.uid;
    
    if (!currentUid) return;

    try {
      // Guardar el pass en Firestore
      await this.querySvc.add('likes', {
        userId: currentUid,
        matchedUserId: uid,
        action: 'pass',
        timestamp: new Date()
      });

      // Remover usuario de las recomendaciones
      this.recommendations = this.recommendations.filter(u => u.uid !== uid);
    } catch (error) {
      console.error('Error al guardar pass:', error);
    }
  }

  public goToProfile(){
    this.router.navigate(['/profile']);
  }

  public goToMatches(){
    this.router.navigate(['/matches']);
  }

  public async logout(){
    try {
      await this.authPrv.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
