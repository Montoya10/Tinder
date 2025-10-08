import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { ErrorHandler } from 'src/app/core/services/error-handler/error-handler';
import { Query } from 'src/app/core/providers/query/query';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/core/services/translation/translation';
import { TranslateService } from '@ngx-translate/core';

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
  public isGoogleUser: boolean = false;
  public userPhoto: string = '';
  public currentLang: string = 'en';

  private userData: any = {};
  private authSubscription!: Subscription;

  constructor(
    private readonly authSrv: Auth,
    private readonly querySrv: Query,
    private router: Router,
    private errorHandler: ErrorHandler,
    private translationService: TranslationService,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  async ngOnInit() {
    this.currentLang = this.translationService.getCurrentLang();
    await this.loadUserData();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.translationService.changeLang(lang);
  }

  private async loadUserData() {
    this.isLoading = true;
    const userId = this.authSrv.currentUserId;
    const currentUser = this.authSrv.currentUser;

    if (!userId || !currentUser) {
      this.translate
        .get('PROFILE.UNAUTHENTICATED')
        .subscribe((message: string) => {
          this.errorHandler.showWarning(message);
        });
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.userData = await this.querySrv.get('users', userId);

      this.isGoogleUser = this.checkIfGoogleUser(currentUser);

      this.userPhoto = this.userData?.photoURL || currentUser.photoURL || '';

      if (this.userData) {
        this.profileForm.patchValue({
          name: this.userData.name || currentUser.displayName || '',
          lastName: this.userData.last || '',
          email: this.userData.email || currentUser.email || '',
        });

        this.fullName =
          `${this.userData.name || currentUser.displayName || ''} ${
            this.userData.last || ''
          }`.trim() || this.translate.instant('PROFILE.MY_PROFILE');

        this.email.disable();

        if (this.isGoogleUser) {
          this.name.disable();
        }
      } else {
        this.profileForm.patchValue({
          name: currentUser.displayName || '',
          lastName: '',
          email: currentUser.email || '',
        });

        this.fullName = currentUser.displayName ||  this.translate.instant('PROFILE.MY_PROFILE');

        if (this.isGoogleUser) {
          this.name.disable();
        }
      }
    } catch (error) {
      this.errorHandler.handleFirebaseError(error, 'cargar perfil');
    } finally {
      this.isLoading = false;
    }
  }

  private checkIfGoogleUser(user: any): boolean {
    return (
      user.providerData &&
      user.providerData.some(
        (provider: any) => provider.providerId === 'google.com'
      )
    );
  }

  public getGoogleUserMessage(): string {
    return this.isGoogleUser
      ? 'Tu perfil está vinculado con Google. Algunos datos no pueden ser editados aquí.'
      : '';
  }

 public toggleEdit() {
    if (this.isGoogleUser) {
      this.translate.get('PROFILE.GOOGLE_USER_MESSAGE').subscribe((message: string) => {
        this.errorHandler.showInfo(message);
      });
      return;
    }

    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.name.enable();
      this.lastName.enable();
    } else {
      this.name.disable();
      this.lastName.disable();

      this.profileForm.patchValue({
        name: this.userData.name,
        lastName: this.userData.last,
      });
    }
  }

  public async updateProfile() {
    if (this.profileForm.invalid) {
      this.translate.get('COMMON.REQUIRED_FIELD').subscribe((message: string) => {
        this.errorHandler.showWarning(message);
      });
      return;
    }

    this.isLoading = true;
    const userId = this.authSrv.currentUserId;

    if (!userId) {
      this.translate.get('PROFILE.UNAUTHENTICATED').subscribe((message: string) => {
        this.errorHandler.showWarning(message);
      });
      this.isLoading = false;
      return;
    }

    try {
      const updateData = {
        name: this.name.value,
        last: this.lastName.value,
        updatedAt: new Date(),
      };

      await this.querySrv.update('users', userId, updateData);

      this.userData = { ...this.userData, ...updateData };
      this.fullName = `${this.name.value} ${this.lastName.value}`.trim();

      this.translate.get('PROFILE.UPDATE_SUCCESS').subscribe((message: string) => {
        this.errorHandler.showSuccess(message);
      });
      this.isEditing = false;
      this.name.disable();
      this.lastName.disable();
    } catch (error) {
      this.errorHandler.handleFirebaseError(error, 'actualizar perfil');
    } finally {
      this.isLoading = false;
    }
  }

  public async changePassword() {
    if (this.isGoogleUser) {
      this.translate.get('PROFILE.GOOGLE_USER_MESSAGE').subscribe((message: string) => {
        this.errorHandler.showInfo(message);
      });
      return;
    }
    
    this.translate.get('PROFILE.PASSWORD_FEATURE').subscribe((message: string) => {
      this.errorHandler.showInfo(message);
    });
  }

  public async logout() {
    try {
      await this.authSrv.logOut();
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorHandler.handleFirebaseError(error, 'cerrar sesión');
    }
  }

  private initForm() {
    this.name = new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]);
    this.lastName = new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]);
    this.email = new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]);

    this.profileForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
    });
  }
}
