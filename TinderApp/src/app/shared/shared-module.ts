import { Input, input, linkedSignal, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { LoginPage } from '../pages/login/login.page';
import { RegisterPage } from '../pages/register/register.page';
import { InputComponent } from './components/input/input.component';
import { IonicModule } from '@ionic/angular';
import { RadioComponent } from './components/radio/radio.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { LinkComponent } from './components/link/link.component';
import { AddButtonComponent } from './components/addbutton/addbutton.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ImageGridComponent } from './components/ImageGrid/image-grid/image-grid.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    InputComponent,
    RadioComponent,
    CardComponent,
    ButtonComponent,
    LinkComponent,
    AddButtonComponent,
    BackButtonComponent,
    ImageGridComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TranslateModule],
  exports: [
    InputComponent,
    RadioComponent,
    CardComponent,
    ButtonComponent,
    LinkComponent,
    AddButtonComponent,
    BackButtonComponent,
    ImageGridComponent,
    TranslateModule
  ],
})
export class SharedModule {}
