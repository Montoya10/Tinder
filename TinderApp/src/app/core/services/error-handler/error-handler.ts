// error-handler.ts
import { Injectable } from '@angular/core';
import { Toast } from 'src/app/core/services/toast/toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {
  
  private firebaseErrorMessages: { [key: string]: string } = {
    
    'auth/email-already-in-use': 'El correo electrónico ya está registrado',
    'auth/invalid-email': 'El formato del correo electrónico no es válido',
    'auth/operation-not-allowed': 'La operación no está permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    
    
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    
    
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/popup-closed-by-user': 'El popup de Google fue cerrado',
    'auth/popup-blocked': 'El popup de Google fue bloqueado',
    'auth/cancelled-popup-request': 'Solicitud de popup cancelada',
    
    
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con el mismo email pero diferente método de autenticación',
  };

  constructor(private toast: Toast) {}

  
  handleFirebaseError(error: any, context: FirebaseContext = 'general') {
    const errorCode = error.code || 'unknown';
    const errorMessage = this.getFirebaseErrorMessage(errorCode, context);
    
    this.toast.showError(errorMessage);
    console.error('Firebase Error:', errorCode, error.message);
  }

  private getFirebaseErrorMessage(errorCode: string, context: FirebaseContext): string {
    if (this.firebaseErrorMessages[errorCode]) {
      return this.firebaseErrorMessages[errorCode];
    }


    const defaultMessages: Record<FirebaseContext, string> = {
      register: 'Error al registrar la cuenta',
      login: 'Error al iniciar sesión',
      google: 'Error al iniciar sesión con Google',
      'cargar perfil': 'Error al cargar el perfil',
      'actualizar perfil': 'Error al actualizar el perfil',
      'cerrar sesión': 'Error al cerrar sesión',
      general: 'Error desconocido'
    };

    return defaultMessages[context] || defaultMessages.general;
  }

  showSuccess(message: string) {
    this.toast.showSuccess(message);
  }

  showWarning(message: string) {
    this.toast.showWarning(message);
  }

  showInfo(message: string) {
    this.toast.showInfo(message);
  }
}


type FirebaseContext = 
  | 'register' 
  | 'login' 
  | 'google' 
  | 'cargar perfil' 
  | 'actualizar perfil' 
  | 'cerrar sesión'
  | 'general';