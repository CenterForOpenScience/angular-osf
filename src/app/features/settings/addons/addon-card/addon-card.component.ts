import { Component, input } from '@angular/core';
import { Button } from 'primeng/button';
import { AddonCard } from '@shared/entities/addon-card.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'osf-addon-card',
  imports: [Button],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  card = input<AddonCard>();

  constructor(private router: Router) {}

  onConnect(): void {
    this.router.navigate(['/settings/addons/connect-addon']);
  }
}
