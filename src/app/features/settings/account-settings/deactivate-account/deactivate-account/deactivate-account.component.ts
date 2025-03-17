import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'osf-deactivate-account',
  imports: [Button],
  templateUrl: './deactivate-account.component.html',
  styleUrl: './deactivate-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateAccountComponent {}
