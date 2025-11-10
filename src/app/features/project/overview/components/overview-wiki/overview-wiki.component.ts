import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { MarkdownComponent } from '@osf/shared/components/markdown/markdown.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { WikiSelectors } from '@osf/shared/stores/wiki';

@Component({
  selector: 'osf-overview-wiki',
  imports: [Skeleton, TranslatePipe, TruncatedTextComponent, MarkdownComponent, Button],
  templateUrl: './overview-wiki.component.html',
  styleUrl: './overview-wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewWikiComponent {
  private readonly router = inject(Router);

  isWikiLoading = select(WikiSelectors.getHomeWikiLoading);
  wikiContent = select(WikiSelectors.getHomeWikiContent);

  resourceId = input('');
  canEdit = input<boolean>(false);

  wikiLink = computed(() => ['/', this.resourceId(), 'wiki']);

  navigateToWiki() {
    this.router.navigate(this.wikiLink());
  }
}
