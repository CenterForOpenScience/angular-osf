import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Card } from 'primeng/card';
import { RegistrationCard } from './registration-card.interface';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-registration-card',
  imports: [Card, Button, Tag],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationCardComponent {
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  registrationData = input<RegistrationCard>();
}
