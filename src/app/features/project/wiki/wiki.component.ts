import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';

import { filter, map, mergeMap, of, tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import {
  CompareSectionComponent,
  EditSectionComponent,
  ViewSectionComponent,
  WikiListComponent,
} from '@osf/shared/components/wiki';
import { ResourceType } from '@osf/shared/enums';
import { WikiModes } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import {
  CreateWiki,
  CreateWikiVersion,
  DeleteWiki,
  GetCompareVersionContent,
  GetComponentsWikiList,
  GetWikiContent,
  GetWikiList,
  GetWikiModes,
  GetWikiVersionContent,
  GetWikiVersions,
  SetCurrentWiki,
  ToggleMode,
  UpdateWikiPreviewContent,
  WikiSelectors,
} from '@osf/shared/stores';

@Component({
  selector: 'osf-wiki',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    ButtonGroupModule,
    Button,
    WikiListComponent,
    ViewSectionComponent,
    EditSectionComponent,
    CompareSectionComponent,
  ],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WikiComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private toastService = inject(ToastService);

  WikiModes = WikiModes;
  homeWikiName = 'Home';

  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  protected wikiModes = select(WikiSelectors.getWikiModes);
  protected previewContent = select(WikiSelectors.getPreviewContent);
  protected versionContent = select(WikiSelectors.getWikiVersionContent);
  protected compareVersionContent = select(WikiSelectors.getCompareVersionContent);
  protected isWikiListLoading = select(WikiSelectors.getWikiListLoading || WikiSelectors.getComponentsWikiListLoading);
  protected wikiList = select(WikiSelectors.getWikiList);
  protected componentsWikiList = select(WikiSelectors.getComponentsWikiList);
  protected currentWikiId = select(WikiSelectors.getCurrentWikiId);
  protected wikiVersions = select(WikiSelectors.getWikiVersions);
  protected isWikiVersionSubmitting = select(WikiSelectors.getWikiVersionSubmitting);
  protected isWikiVersionLoading = select(WikiSelectors.getWikiVersionsLoading);
  protected isCompareVersionLoading = select(WikiSelectors.getCompareVersionsLoading);

  protected actions = createDispatchMap({
    getWikiModes: GetWikiModes,
    toggleMode: ToggleMode,
    getWikiContent: GetWikiContent,
    getWikiList: GetWikiList,
    getComponentsWikiList: GetComponentsWikiList,
    updateWikiPreviewContent: UpdateWikiPreviewContent,
    setCurrentWiki: SetCurrentWiki,
    deleteWiki: DeleteWiki,
    createWiki: CreateWiki,
    getWikiVersions: GetWikiVersions,
    createWikiVersion: CreateWikiVersion,
    getWikiVersionContent: GetWikiVersionContent,
    getCompareVersionContent: GetCompareVersionContent,
  });

  protected wikiIdFromQueryParams = this.route.snapshot.queryParams['wiki'];

  constructor() {
    this.actions
      .getWikiList(ResourceType.Project, this.projectId())
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          if (!this.wikiIdFromQueryParams) {
            this.navigateToWiki(this.wikiList()?.[0]?.id || '');
          }
          if (!this.wikiList()?.length) {
            this.actions.createWiki(ResourceType.Project, this.projectId(), this.homeWikiName);
          }
        })
      )
      .subscribe();

    this.actions.getComponentsWikiList(ResourceType.Project, this.projectId());

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

  updateWikiPreviewContent(content: string) {
    this.actions.updateWikiPreviewContent(content);
  }

  onCreateWiki() {
    this.navigateToWiki(this.currentWikiId());
  }

  onDeleteWiki() {
    this.actions.deleteWiki(this.currentWikiId()).pipe(tap(() => this.navigateToWiki(this.currentWikiId())));
  }

  onSaveContent(content: string) {
    this.actions
      .createWikiVersion(this.currentWikiId(), content)
      .pipe(
        tap(() => {
          this.toastService.showSuccess('project.wiki.version.successSaved');
          this.actions.getWikiVersions(this.currentWikiId());
        })
      )
      .subscribe();
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
