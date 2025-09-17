import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'osf-metadata-date-info',
  imports: [Card, DatePipe, TranslatePipe],
  templateUrl: './metadata-date-info.component.html',
  styleUrl: './metadata-date-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataDateInfoComponent {
  dateCreated = input<string | undefined>('');
  dateModified = input<string | undefined>('');

  readonly dateFormat = 'MMM d, y, h:mm a';
}
