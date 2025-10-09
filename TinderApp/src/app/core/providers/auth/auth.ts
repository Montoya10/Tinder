import { Injectable } from '@angular/core';
import { Auth as AuthFire, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { Credentials } from 'src/domain/model/credentials.model';
import { User } from 'src/domain/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private readonly afb: AuthFire) { }

  async register(credentials : Credentials, user : User): Promise <string> {
    try {
      const response = await createUserWithEmailAndPassword(
        this.afb,
        credentials.email,
        credentials.password
      )
      
      return response.user.uid;
    } catch (error) {
      console.error((error as any).message);
      throw error;
    }
  }

  async loginWithEmailAndPassword(credential: Credentials): Promise <string> {
    try {
      if (!credential.email) {
        throw new Error('Email is required');
      }
      if (!credential.password) {
        throw new Error('Password is required');
      }

      const response = await signInWithEmailAndPassword(
        this.afb,
        credential.email,
        credential.password
      );
      return response.user.uid;
    } catch (error) {
      console.error((error as any).message);
      throw error;
    }
  }

  async logout() {
    try{
      await this.afb.signOut();
    }catch(error){
      console.error('Error logging out user:', error);
    }
  }
}


