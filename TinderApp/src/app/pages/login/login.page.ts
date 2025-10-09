import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Credentials } from 'src/domain/model/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  public email !: FormControl;
  public password !: FormControl;
  public loginForm !: FormGroup;

  constructor(private readonly authPrv: Auth, private readonly router : Router) { 
    this.initForm();
  }

  ngOnInit() {
  }

  private initForm(){
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl ('' , [Validators.required, Validators.minLength(8)]);

    this.loginForm = new FormGroup ({
      email : this.email,
      password : this.password,
    })
  }
  
  public goToRegister(){
    this.router.navigate(['/register']);
  }

  public async onSubmit(){
     try {
      const credential: Credentials = { email: this.email.value, password: this.password.value };
      await this.authPrv.loginWithEmailAndPassword(credential);
      this.router.navigate(['/home']);
    } catch (error) {
      console.log((error as any).message);
    }
  }

}
