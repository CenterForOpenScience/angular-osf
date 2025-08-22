import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MarkdownComponent, TruncatedTextComponent } from '@osf/shared/components';
import { WikiSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-project-wiki',
  imports: [Skeleton, TranslatePipe, TruncatedTextComponent, MarkdownComponent],
  templateUrl: './overview-wiki.component.html',
  styleUrl: './overview-wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewWikiComponent {
  protected isWikiLoading = select(WikiSelectors.getHomeWikiLoading);
  protected wikiContent = select(WikiSelectors.getHomeWikiContent);
}
