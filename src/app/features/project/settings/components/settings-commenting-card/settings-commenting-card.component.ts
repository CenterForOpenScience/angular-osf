import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ShareIndexingEnum } from '@osf/features/settings/account-settings/components/share-indexing/enums/share-indexing.enum';

@Component({
  selector: 'osf-settings-commenting-card',
  imports: [Card, RadioButton, TranslatePipe, FormsModule],
  templateUrl: './settings-commenting-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsCommentingCardComponent {
  commenting = model<ShareIndexingEnum>();
}
