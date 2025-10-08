import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone:false,
})
export class BackButtonComponent {
  @Input() defaultBack: string = ''; // Ruta por defecto si no hay historial
  @Input() color: string = 'primary'; // Color del botón
  @Input() fill: string = 'clear'; // Estilo del botón (clear, solid, outline)
  @Input() icon: string = 'arrow-back'; // Icono a mostrar

  constructor(
    private location: Location,
    private navCtrl: NavController
  ) {}

  goBack() {
    if (window.history.length > 1) {
      
      this.location.back();
    } else if (this.defaultBack) {
      
      this.navCtrl.navigateRoot(this.defaultBack);
    } else {
      
      this.navCtrl.navigateRoot('/home');
    }
  }
}