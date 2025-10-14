import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { MarkdownComponent, TruncatedTextComponent } from '@osf/shared/components';
import { WikiSelectors } from '@osf/shared/stores';

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

  wikiLink = computed(() => ['/', this.resourceId(), 'wiki']);

  navigateToWiki() {
    this.router.navigate(this.wikiLink());
  }
}
