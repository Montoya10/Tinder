import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  standalone: false,
  
})
export class RadioComponent implements OnInit {
  @Input() label: string = '';
  @Input() justify: 'start' | 'end' | 'space-between' = 'start';
  @Input() value: string = '';
  @Input() options: { value: string; label: string }[] = [];
  @Input() languajes: boolean = false; // Propiedad específica para idiomas
  @Output() valueChange = new EventEmitter<string>();

  // Opciones predefinidas para idiomas si se usa la propiedad languajes
  private languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ];

  ngOnInit() {
    // Si se activa la propiedad languajes, establecer las opciones automáticamente
    if (this.languajes && this.options.length === 0) {
      this.options = this.languageOptions;
    }
  }

  onValueChange(event: any) {
    const newValue = event.detail.value;
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  getJustifyClass(): string {
    switch (this.justify) {
      case 'end':
        return 'justify-end';
      case 'space-between':
        return 'justify-space-between';
      default:
        return 'justify-start';
    }
  }
}