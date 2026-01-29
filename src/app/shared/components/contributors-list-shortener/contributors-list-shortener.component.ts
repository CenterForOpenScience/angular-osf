import { TranslatePipe } from '@ngx-translate/core';

import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';

@Component({
  selector: 'osf-contributors-list-shortener',
  imports: [Tooltip, TranslatePipe],
  templateUrl: './contributors-list-shortener.component.html',
  styleUrl: './contributors-list-shortener.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsListShortenerComponent {
  data = input<ContributorModel[]>([]);
  limit = input<number>(2);
}
