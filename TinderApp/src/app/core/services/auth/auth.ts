import { Injectable } from '@angular/core';
import {
  Auth as AuthFirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from '@angular/fire/auth';
import { Query } from '../../providers/query/query';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private readonly afb: AuthFirebase,     private readonly querySrv: Query) {}

  //register
  async register(email: string, password: string): Promise<string> {
    try {
      const response = await createUserWithEmailAndPassword(
        this.afb,
        email,
        password
      );
      console.log(response);
      return response.user.uid;
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

  //login

  async login(email: string, password: string) {
    try {
      const resp = await signInWithEmailAndPassword(this.afb, email, password);
      console.log(resp);
      
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

  //logout
  async logOut() {
    await signOut(this.afb);
  }

  //login with google

async loginWithGoogle() {
    try {
      const googleProvider = new GoogleAuthProvider();
      const response = await signInWithPopup(this.afb, googleProvider);
      
      
      const user = response.user;
      await this.saveGoogleUserData(user);
      
      return user;
    } catch (error) {
      console.log((error as any).message);
      throw error;
    }
  }

    private async saveGoogleUserData(user: User) {
    try {
      const userData = {
        name: user.displayName || '',
        last: '', 
        email: user.email || '',
        photoURL: user.photoURL || '',
        provider: 'google',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.querySrv.create('users', userData, user.uid);
      console.log('Datos de usuario de Google guardados en Firestore');
    } catch (error) {
      console.error('Error al guardar datos de Google:', error);
      throw error;
    }
  }


// usuario actual
    get currentUser(): User | null {
    return this.afb.currentUser;
  }

  //UID del usuario actual
  get currentUserId(): string | null {
    return this.afb.currentUser?.uid || null;
  }
}
