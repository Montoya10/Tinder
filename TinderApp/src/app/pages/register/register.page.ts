import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { File } from 'src/app/core/providers/file/file';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public page: number = 0;
  public gender : string = '';
  public registerForm !: FormGroup;
  public ageError: string = '';

  public passionsOps = [
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Travel', value: 'travel' },
    { label: 'Reading', value: 'reading' },
    { label: 'Movies', value: 'movies' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Movies', value: 'movies' },
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
    // Marcar el campo birthdate como touched cuando cambie para mostrar errores inmediatamente
    this.registerForm.get('birthdate')?.valueChanges.subscribe(() => {
      this.registerForm.get('birthdate')?.markAsTouched();
    });
  }

  changePage(next: boolean) {
    if (next && this.isPageValid()) {
      this.page++;
    } else if (!next) {
      this.page--;
    }
    console.log(this.registerForm.value);
  }

  public selectGender(value: string) {
    this.gender = value;
    this.registerForm.get('gender')?.setValue(value);
  }

  public isPageValid(): boolean {
    if (this.page === 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'country'];
      return requiredFields.every(field => {
        const control = this.registerForm.get(field);
        return control && control.valid;
      });
    }
    if (this.page === 1) {
      // Validar que se haya seleccionado un género
      const genderControl = this.registerForm.get('gender');
      return !!(genderControl && genderControl.valid && genderControl.value !== '');
    }
    if (this.page === 2) {
      // Validar que la fecha de nacimiento sea válida y mayor de 18 años
      const birthdateControl = this.registerForm.get('birthdate');
      return !!(birthdateControl && birthdateControl.valid);
    }
    return true;
  }


  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    

    const exactAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    if (exactAge < 18) {
      return { underage: { requiredAge: 18, currentAge: exactAge } };
    }

    return null;
  }

  public getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['underage']) {
        return `You must be at least 18 years old. Current age: ${field.errors['underage'].currentAge}`;
      }
    }
    return '';
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
    const images = await this.fileSrv.pickImage();
    console.log(images.data);
  }
}
