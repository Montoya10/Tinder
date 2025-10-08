import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { ErrorHandler } from 'src/app/core/services/error-handler/error-handler';
import { Query } from 'src/app/core/providers/query/query';
import { TranslationService } from 'src/app/core/services/translation/translation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public name!: FormControl;
  public lastName!: FormControl;
  public email!: FormControl;
  public password!: FormControl;
  public registerForm!: FormGroup;
  public isLoading: boolean = false;
  public currentLang: string = 'en';

  constructor(
    private readonly authSrv: Auth,
    private router: Router,
    private errorHandler: ErrorHandler,
    private readonly querySrv: Query,
    private translationService: TranslationService,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.currentLang = this.translationService.getCurrentLang();
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.translationService.changeLang(lang);
  }

    public async doRegister() {
    if (this.registerForm.invalid) {
      this.translate.get('COMMON.REQUIRED_FIELD').subscribe((message: string) => {
        this.errorHandler.showWarning(message);
      });
      return;
    }

    this.isLoading = true;

    try {
      const uid = await this.authSrv.register(
        this.email.value,
        this.password.value
      );
      await this.querySrv.create(
        'users',
        {
          name: this.name.value,
          last: this.lastName.value,
          email: this.email.value,
        },
        uid
      );

      this.translate.get('REGISTER.SUCCESS').subscribe((message: string) => {
        this.errorHandler.showSuccess(message);
      });
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorHandler.handleFirebaseError(error, 'register');
    } finally {
      this.isLoading = false;
    }
  }

  private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]);

    this.registerForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });
  }

  public goToLogin() {
    this.router.navigate(['/login']);
  }
}