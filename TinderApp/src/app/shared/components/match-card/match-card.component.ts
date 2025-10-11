import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { User } from '../../../../domain/model/user.model';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MatchCardComponent {
  @Input() user!: User;
  @Output() like = new EventEmitter<string>();
  @Output() pass = new EventEmitter<string>();

  get age(): number {
    if (!this.user?.birthDate) return 0;
    const birth = new Date(this.user.birthDate);
    const diff = Date.now() - birth.getTime();
    return Math.floor(new Date(diff).getUTCFullYear() - 1970);
  }

  onLike() { this.like.emit(this.user.uid); }
  onPass() { this.pass.emit(this.user.uid); }
}
