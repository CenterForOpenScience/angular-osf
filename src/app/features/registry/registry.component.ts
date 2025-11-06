import { createDispatchMap, select } from '@ngxs/store';

import { map } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { pathJoin } from '@osf/shared/helpers/path-join.helper';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ContributorsSelectors, GetBibliographicContributors } from '@osf/shared/stores/contributors';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { GetRegistryIdentifiers, GetRegistryWithRelatedData, RegistrySelectors } from './store/registry';

@Component({
  selector: 'osf-registry',
  imports: [RouterOutlet],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class RegistryComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column';

  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);
  private readonly dataciteService = inject(DataciteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly environment = inject(ENVIRONMENT);
  private readonly prerenderReady = inject(PrerenderReadyService);

  private readonly actions = createDispatchMap({
    getRegistryWithRelatedData: GetRegistryWithRelatedData,
    clearCurrentProvider: ClearCurrentProvider,
    getBibliographicContributors: GetBibliographicContributors,
    getIdentifiers: GetRegistryIdentifiers,
  });

  private registryId = toSignal(this.route.params.pipe(map((params) => params['id'])));

  readonly registry = select(RegistrySelectors.getRegistry);
  readonly isRegistryLoading = select(RegistrySelectors.isRegistryLoading);
  readonly identifiersForDatacite$ = toObservable(select(RegistrySelectors.getIdentifiers)).pipe(
    map((identifiers) => (identifiers?.length ? { identifiers } : null))
  );
  readonly analyticsService = inject(AnalyticsService);
  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly license = select(RegistrySelectors.getLicense);
  readonly isLicenseLoading = select(RegistrySelectors.isLicenseLoading);
  readonly isIdentifiersLoading = select(RegistrySelectors.isIdentifiersLoading);

  private readonly allDataLoaded = computed(
    () =>
      !this.isRegistryLoading() &&
      !this.isBibliographicContributorsLoading() &&
      !this.isLicenseLoading() &&
      !!this.registry()
  );

  private readonly lastMetaTagsRegistryId = signal<string | null>(null);

  constructor() {
    this.prerenderReady.setNotReady();

    effect(() => {
      const id = this.registryId();

      if (id) {
        this.actions.getRegistryWithRelatedData(id);
        this.actions.getIdentifiers(id);
        this.actions.getBibliographicContributors(id, ResourceType.Registration);
      }
    });

    effect(() => {
      if (this.allDataLoaded()) {
        const currentRegistry = this.registry();
        const currentRegistryId = currentRegistry?.id ?? null;
        const lastSetRegistryId = this.lastMetaTagsRegistryId();

        if (currentRegistryId && currentRegistryId !== lastSetRegistryId) {
          this.setMetaTags();
        }
      }
    });

    effect(() => {
      const currentRegistry = this.registry();
      if (currentRegistry && currentRegistry.isPublic) {
        this.analyticsService.sendCountedUsage(currentRegistry.id, 'registry.detail').subscribe();
      }
    });

    this.dataciteService
      .logIdentifiableView(this.identifiersForDatacite$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
  }

  private setMetaTags(): void {
    const currentRegistry = this.registry();
    if (!currentRegistry) return;

    this.metaTags.updateMetaTags(
      {
        osfGuid: currentRegistry.id,
        title: currentRegistry.title,
        description: currentRegistry.description,
        publishedDate: this.datePipe.transform(currentRegistry.dateRegistered, 'yyyy-MM-dd'),
        modifiedDate: this.datePipe.transform(currentRegistry.dateModified, 'yyyy-MM-dd'),
        url: pathJoin(this.environment.webUrl, currentRegistry.id ?? ''),
        identifier: currentRegistry.id,
        doi: currentRegistry.articleDoi,
        keywords: currentRegistry.tags,
        siteName: 'OSF',
        license: this.license()?.name,
        contributors:
          this.bibliographicContributors()?.map((contributor) => ({
            fullName: contributor.fullName,
            givenName: contributor.givenName,
            familyName: contributor.familyName,
          })) ?? [],
      },
      this.destroyRef
    );

    this.lastMetaTagsRegistryId.set(currentRegistry.id);
  }
}
