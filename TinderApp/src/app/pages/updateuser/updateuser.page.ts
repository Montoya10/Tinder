import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth } from '../../core/providers/auth/auth';
import { Query } from '../../core/services/query/query';
import { Auth as AuthFire } from '@angular/fire/auth';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
  standalone: false,
})
export class UpdateuserPage implements OnInit, OnDestroy {
  public name!: FormControl;
  public lastName!: FormControl;
  public email!: FormControl;
  public profileForm!: FormGroup;
  public isLoading: boolean = false;
  public isEditing: boolean = false;
  public fullName: string = 'Mi Perfil';
  public userPhoto: string = '';

  private userData: any = {};
  private authSubscription?: Subscription;

  constructor(
    private readonly authPrv: Auth,
    private readonly authFire: AuthFire,
    private readonly querySvc: Query,
    private readonly router: Router
  ) {
    this.initForm();
  }

  async ngOnInit() {
    await this.loadUserData();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private async loadUserData() {
    this.isLoading = true;
    const userId = this.authFire.currentUser?.uid;
    const currentUser = this.authFire.currentUser;

    if (!userId || !currentUser) {
      alert('Usuario no autenticado');
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.userData = await this.querySvc.get('users', userId);

      this.userPhoto = this.userData?.photos?.[0] || '';

      if (this.userData) {
        this.profileForm.patchValue({
          name: this.userData.name || '',
          lastName: this.userData.lastName || '',
          email: this.userData.email || currentUser.email || '',
        });

        this.fullName = `${this.userData.name || ''} ${this.userData.lastName || ''}`.trim() || 'Mi Perfil';

        this.email.disable();
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      alert('Error al cargar el perfil');
    } finally {
      this.isLoading = false;
    }
  }

  public toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.name.enable();
      this.lastName.enable();
    } else {
      this.name.disable();
      this.lastName.disable();

      this.profileForm.patchValue({
        name: this.userData.name,
        lastName: this.userData.lastName,
      });
    }
  }

  public async updateProfile() {
    if (this.profileForm.invalid) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    const userId = this.authFire.currentUser?.uid;

    if (!userId) {
      alert('Usuario no autenticado');
      this.isLoading = false;
      return;
    }

    try {
      const updateData = {
        name: this.name.value,
        lastName: this.lastName.value,
        updatedAt: new Date(),
      };

      await this.querySvc.update('users', userId, updateData);

      this.userData = { ...this.userData, ...updateData };
      this.fullName = `${this.name.value} ${this.lastName.value}`.trim();

      alert('Perfil actualizado exitosamente');
      this.isEditing = false;
      this.name.disable();
      this.lastName.disable();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      this.isLoading = false;
    }
  }

  public async changePhoto() {
    // TODO: Implementar cambio de foto con Filepicker y Uploader
    alert('Funcionalidad de cambio de foto - Próximamente');
  }

  public async changePassword() {
    const oldPassword = prompt('Ingresa tu contraseña actual:');
    if (!oldPassword) return;

    const newPassword = prompt('Ingresa tu nueva contraseña (mínimo 6 caracteres):');
    if (!newPassword || newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const confirmPassword = prompt('Confirma tu nueva contraseña:');
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      this.isLoading = true;
      // Reautenticar usuario primero
      const user = this.authFire.currentUser;
      if (!user || !user.email) {
        alert('Usuario no autenticado');
        return;
      }

      // Importar funciones necesarias
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('@angular/fire/auth');
      
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      alert('Contraseña actualizada exitosamente');
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Contraseña actual incorrecta');
      } else {
        alert('Error al cambiar la contraseña');
      }
    } finally {
      this.isLoading = false;
    }
  }

  public async logout() {
    try {
      await this.authPrv.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  }

  private initForm() {
    this.name = new FormControl({ value: '', disabled: true }, [Validators.required]);
    this.lastName = new FormControl({ value: '', disabled: true }, [Validators.required]);
    this.email = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]);

    this.profileForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
    });
  }
}
