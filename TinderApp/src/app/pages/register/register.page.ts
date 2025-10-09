import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { File } from 'src/app/core/providers/file/file';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public page = 0;
  public gender = '';
  public registerForm!: FormGroup;
  public ageError = '';
  private birthdateSub?: Subscription;

  public passionsOps = [
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Travel', value: 'travel' },
    { label: 'Reading', value: 'reading' },
    { label: 'Movies', value: 'movies' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Yoga', value: 'yoga' },
    { label: 'Video Games', value: 'video_games' },
    { label: 'Books', value: 'books' },
    { label: 'Lofi', value: 'lofi' },
    { label: 'Gym', value: 'gym' }
  ];

  // Opciones para el radio de género

  constructor(private formBuilder: FormBuilder, private readonly fileSrv: File) {
    this.initForm();
  }

  ngOnInit() {
    // Marcar birthdate como touched al cambiar su valor para disparar validación inmediata
    this.birthdateSub = this.getControl('birthdate')?.valueChanges.subscribe(() => {
      this.getControl('birthdate')?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.birthdateSub?.unsubscribe();
  }

  changePage(next: boolean) {
    const maxPage = 2;
    if (next) {
      if (this.isPageValid() && this.page < maxPage) {
        this.page++;
      }
    } else {
      if (this.page > 0) this.page--;
    }
    console.log('Register form snapshot:', this.registerForm.value);
  }

  public selectGender(value: string) {
    this.gender = value;
    this.getControl('gender')?.setValue(value);
    this.getControl('gender')?.markAsTouched();
  }

  public isPageValid(): boolean {
    if (this.page === 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'country'];
      return requiredFields.every(name => this.getControl(name)?.valid ?? false);
    }

    if (this.page === 1) {
      // Validar que se haya seleccionado un género
      const g = this.getControl('gender');
      return !!(g && g.valid && g.value);
    }

    if (this.page === 2) {
      const b = this.getControl('birthdate');
      return !!(b && b.valid);
    }

    return true;
  }


  private ageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    if (isNaN(birthDate.getTime())) return { invalidDate: true };

    const currentAge = this.calculateAge(birthDate);
    if (currentAge < 18) return { underage: { requiredAge: 18, currentAge } };

    return null;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    // Restar un día para evitar problemas con zonas horarias y nacidos hoy
    today.setDate(today.getDate() - 1);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  public getFieldError(fieldName: string): string {
    const field = this.getControl(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) return `${this.humanize(fieldName)} es requerido`;
    if (field.errors['email']) return 'Introduce un correo electrónico válido';
    if (field.errors['minlength']) return `La contraseña debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['underage']) return `Debes tener al menos 18 años. Edad actual: ${field.errors['underage'].currentAge}`;
    if (field.errors['invalidDate']) return 'Fecha inválida';

    return '';
  }

  private humanize(name: string) {
    // Convierte camelCase o snake_case a texto legible
    return name.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  private initForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required]],
      showGenderProfile: [false, [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required, this.ageValidator.bind(this)]],
      passion: [[], [Validators.required]],
      photos: [[], [Validators.required]]
    });
  }
  public selectInterest(value: string) {
    const passionsControl = this.registerForm.get('passion');
    if (passionsControl) {
      const currentValues = passionsControl.value || [];
      if (currentValues.includes(value)) {
        passionsControl.setValue(currentValues.filter((v: string) => v !== value));
      } else {
        passionsControl.setValue([...currentValues, value]);
      }
      passionsControl.markAsTouched();
  }
}

  public isPassionSelected(value: string): boolean {
    const passionsControl = this.registerForm.get('passion');
    if (!passionsControl) return false;
    const currentValues = passionsControl.value || [];
    return currentValues.indexOf(value) !== -1;
  }

  public async selectImages() {
    try {
      const images = await this.fileSrv.pickImage();
      const data = images?.data ?? [];
      console.log('Selected images:', data);
      this.getControl('photos')?.setValue(data);
      this.getControl('photos')?.markAsTouched();
    } catch (err) {
      console.error('Error selecting images', err);
    }
  }

  private getControl(name: string): AbstractControl | null {
    return this.registerForm.get(name) ?? null;
  }
}
