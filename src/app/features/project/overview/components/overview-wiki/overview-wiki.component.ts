import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TruncatedTextComponent } from '@osf/shared/components';
import { WikiSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-overview-wiki',
  imports: [Skeleton, TranslatePipe, TruncatedTextComponent],
  templateUrl: './overview-wiki.component.html',
  styleUrl: './overview-wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewWikiComponent {
  isWikiLoading = select(WikiSelectors.getHomeWikiLoading);
  wikiContent = select(WikiSelectors.getHomeWikiContent);

  resourceId = input('');

  wikiLink = () => ['/', this.resourceId(), 'wiki'];
}
