import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-button',
  templateUrl: './addbutton.component.html',
  styleUrls: ['./addbutton.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AddButtonComponent {
  @Input() showLogout: boolean = true;
  @Input() showAdd: boolean = true;
  @Input() showProfile: boolean = true;
  
  @Output() onLogout = new EventEmitter<void>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() onProfile = new EventEmitter<void>();

  handleLogout() {
    this.onLogout.emit();
  }

  handleAdd() {
    this.onAdd.emit();
  }

  handleProfile() {
    this.onProfile.emit();
  }
}
