import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonFab, 
  IonFabButton, 
  IonFabList, 
  IonIcon 
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { 
  chevronUpCircle, 
  logOutOutline, 
  addOutline, 
  personOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-add-button',
  templateUrl: './addbutton.component.html',
  styleUrls: ['./addbutton.component.scss'],
  standalone: false
})
export class AddButtonComponent {
  @Input() showLogout: boolean = true;
  @Input() showAdd: boolean = true;
  @Input() showUpdateUser: boolean = true;
  
  @Output() onLogout = new EventEmitter<void>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() onUpdateUser = new EventEmitter<void>();

  constructor() {
    addIcons({ 
      chevronUpCircle, 
      logOutOutline, 
      addOutline, 
      personOutline 
      
    });
  }

  handleLogout() {
    this.onLogout.emit();
  }

  handleAdd() {
    this.onAdd.emit();
  }

  handleUpdateUser() {
    this.onUpdateUser.emit();
  }
}