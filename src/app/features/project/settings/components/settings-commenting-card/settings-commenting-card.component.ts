import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-settings-commenting-card',
  imports: [Card, RadioButton, TranslatePipe, FormsModule],
  templateUrl: './settings-commenting-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsCommentingCardComponent {
  anyoneCanComment = input.required<boolean>();
  readonly anyoneCanCommentChange = output<boolean>();
}
