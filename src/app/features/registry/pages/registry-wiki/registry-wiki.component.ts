import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';

import { filter, map, of, switchMap, tap } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModes } from '@osf/shared/models/wiki/wiki.model';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import {
  ClearWiki,
  GetCompareVersionContent,
  GetComponentsWikiList,
  GetWikiContent,
  GetWikiList,
  GetWikiVersionContent,
  GetWikiVersions,
  SetCurrentWiki,
  ToggleMode,
  WikiSelectors,
} from '@osf/shared/stores/wiki';

@Component({
  selector: 'osf-registry-wiki',
  imports: [
    Button,
    ButtonGroup,
    SubHeaderComponent,
    WikiListComponent,
    ViewSectionComponent,
    CompareSectionComponent,
    ViewOnlyLinkMessageComponent,
    TranslatePipe,
  ],
  templateUrl: './registry-wiki.component.html',
  styleUrl: './registry-wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryWikiComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  WikiModes = WikiModes;
  wikiModes = select(WikiSelectors.getWikiModes);
  previewContent = select(WikiSelectors.getPreviewContent);
  versionContent = select(WikiSelectors.getWikiVersionContent);
  compareVersionContent = select(WikiSelectors.getCompareVersionContent);

  private readonly wikiListLoading = select(WikiSelectors.getWikiListLoading);
  private readonly componentsWikiListLoading = select(WikiSelectors.getComponentsWikiListLoading);
  isWikiListLoading = computed(() => this.wikiListLoading() || this.componentsWikiListLoading());

  wikiList = select(WikiSelectors.getWikiList);
  currentWikiId = select(WikiSelectors.getCurrentWikiId);
  wikiVersions = select(WikiSelectors.getWikiVersions);
  isWikiVersionLoading = select(WikiSelectors.getWikiVersionsLoading);
  componentsWikiList = select(WikiSelectors.getComponentsWikiList);

  hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));

  readonly resourceId = toSignal<string | undefined>(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );

  actions = createDispatchMap({
    toggleMode: ToggleMode,
    getWikiContent: GetWikiContent,
    getWikiList: GetWikiList,
    setCurrentWiki: SetCurrentWiki,
    getWikiVersions: GetWikiVersions,
    getWikiVersionContent: GetWikiVersionContent,
    getCompareVersionContent: GetCompareVersionContent,
    getComponentsWikiList: GetComponentsWikiList,
    clearWiki: ClearWiki,
  });

  constructor() {
    const resourceId = this.resourceId();
    const wikiIdFromQueryParams = this.route.snapshot.queryParams['wiki'];

    if (resourceId) {
      this.actions
        .getWikiList(ResourceType.Registration, resourceId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => {
            if (!wikiIdFromQueryParams) {
              this.navigateToWiki(this.wikiList()?.[0]?.id || '');
            }
          })
        )
        .subscribe();

      this.actions.getComponentsWikiList(ResourceType.Registration, resourceId);
    }

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((params) => params['wiki']),
        filter((wikiId) => !!wikiId),
        tap((wikiId) => this.actions.setCurrentWiki(wikiId)),
        switchMap((wikiId) => this.actions.getWikiVersions(wikiId))
      )
      .subscribe();

    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.actions.clearWiki();
      }
    });
  }

  toggleMode(mode: WikiModes) {
    this.actions.toggleMode(mode);
  }

  onSelectVersion(versionId: string) {
    if (versionId) {
      this.actions.getWikiVersionContent(this.currentWikiId(), versionId);
    }
  }

  onSelectCompareVersion(versionId: string) {
    if (versionId) {
      this.actions.getCompareVersionContent(this.currentWikiId(), versionId);
    }
  }

  private navigateToWiki(wiki: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { wiki },
      queryParamsHandling: 'merge',
    });
  }
}
