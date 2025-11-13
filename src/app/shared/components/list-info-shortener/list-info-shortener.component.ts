import { TranslatePipe } from '@ngx-translate/core';

import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IdNameModel } from '@osf/shared/models/common/id-name.model';

@Component({
  selector: 'osf-list-info-shortener',
  imports: [Tooltip, TranslatePipe],
  templateUrl: './list-info-shortener.component.html',
  styleUrl: './list-info-shortener.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInfoShortenerComponent {
  data = input<IdNameModel[]>([]);
  limit = input<number>(2);
}
