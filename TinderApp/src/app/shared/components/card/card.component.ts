import { Component, OnInit } from '@angular/core';
import { IonCardHeader, IonCard } from "@ionic/angular/standalone";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone:false
})
export class CardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
