import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { UpdateuserPageRoutingModule } from './updateuser-routing.module';
import { UpdateuserPage } from './updateuser.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    SharedModule,
    IonicModule,
    UpdateuserPageRoutingModule,
  ],
  declarations: [UpdateuserPage] 
})
export class UpdateuserPageModule {}