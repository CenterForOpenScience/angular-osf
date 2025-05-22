import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WikiSelectors } from '@osf/features/project/wiki/store';
import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';

@Component({
  selector: 'osf-project-wiki',
  imports: [Skeleton, TranslatePipe, TruncatedTextComponent],
  templateUrl: './overview-wiki.component.html',
  styleUrl: './overview-wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewWikiComponent {
  protected isWikiLoading = select(WikiSelectors.getHomeWikiLoading);
  protected wikiContent = select(WikiSelectors.getHomeWikiContent);
}
