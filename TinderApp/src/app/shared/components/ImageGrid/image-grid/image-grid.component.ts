import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonSpinner, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss'],
  standalone: false
  
})
export class ImageGridComponent {
  @Input() imageUrls: any[] = [];
  @Input() isLoading: boolean = false;
  @Output() imageRemoved = new EventEmitter<any>();

  constructor() {}

  removeImage(image: any) {
    this.imageRemoved.emit(image);
  }
}