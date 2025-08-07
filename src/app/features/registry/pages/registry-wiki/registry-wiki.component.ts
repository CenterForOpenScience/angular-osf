import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';

import { filter, map, mergeMap, tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { CompareSectionComponent, ViewSectionComponent, WikiListComponent } from '@osf/shared/components/wiki';
import { ResourceType } from '@osf/shared/enums';
import { WikiModes } from '@osf/shared/models';
import {
  GetCompareVersionContent,
  GetWikiContent,
  GetWikiList,
  GetWikiVersionContent,
  GetWikiVersions,
  SetCurrentWiki,
  ToggleMode,
  WikiSelectors,
} from '@osf/shared/stores';

@Component({
  selector: 'osf-registry-wiki',
  imports: [
    SubHeaderComponent,
    Button,
    ButtonGroup,
    TranslatePipe,
    WikiListComponent,
    ViewSectionComponent,
    CompareSectionComponent,
  ],
  templateUrl: './registry-wiki.component.html',
  styleUrl: './registry-wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryWikiComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  WikiModes = WikiModes;
  protected wikiModes = select(WikiSelectors.getWikiModes);
  protected previewContent = select(WikiSelectors.getPreviewContent);
  protected versionContent = select(WikiSelectors.getWikiVersionContent);
  protected compareVersionContent = select(WikiSelectors.getCompareVersionContent);
  protected isWikiListLoading = select(WikiSelectors.getWikiListLoading || WikiSelectors.getComponentsWikiListLoading);
  protected wikiList = select(WikiSelectors.getWikiList);
  protected currentWikiId = select(WikiSelectors.getCurrentWikiId);
  protected wikiVersions = select(WikiSelectors.getWikiVersions);
  protected isWikiVersionLoading = select(WikiSelectors.getWikiVersionsLoading);

  readonly resourceId = this.route.parent?.snapshot.params['id'];

  protected actions = createDispatchMap({
    toggleMode: ToggleMode,
    getWikiContent: GetWikiContent,
    getWikiList: GetWikiList,
    setCurrentWiki: SetCurrentWiki,
    getWikiVersions: GetWikiVersions,
    getWikiVersionContent: GetWikiVersionContent,
    getCompareVersionContent: GetCompareVersionContent,
  });

  protected wikiIdFromQueryParams = this.route.snapshot.queryParams['wiki'];

  constructor() {
    this.actions
      .getWikiList(ResourceType.Registration, this.resourceId)
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          if (!this.wikiIdFromQueryParams) {
            this.navigateToWiki(this.wikiList()?.[0]?.id || '');
          }
        })
      )
      .subscribe();

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(),
        map((params) => params['wiki']),
        filter((wikiId) => wikiId),
        tap((wikiId) => {
          this.actions.setCurrentWiki(wikiId);
        }),
        mergeMap((wikiId) => this.actions.getWikiVersions(wikiId))
      )
      .subscribe();
  }

  toggleMode(mode: WikiModes) {
    this.actions.toggleMode(mode);
  }

  onSelectVersion(versionId: string) {
    this.actions.getWikiVersionContent(this.currentWikiId(), versionId);
  }

  onSelectCompareVersion(versionId: string) {
    this.actions.getCompareVersionContent(this.currentWikiId(), versionId);
  }

  private navigateToWiki(wiki: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { wiki },
      queryParamsHandling: 'merge',
    });
  }
}
