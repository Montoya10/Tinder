import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './components/input/input.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { MatchCardComponent } from './components/match-card/match-card.component';

@NgModule({
  declarations: [InputComponent, CardComponent, ButtonComponent],
  imports: [
    CommonModule, IonicModule, MatchCardComponent
  ],
  exports: [InputComponent, CardComponent, ButtonComponent, MatchCardComponent]
})
export class SharedModule { }
