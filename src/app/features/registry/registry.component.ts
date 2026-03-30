import { createDispatchMap, select } from '@ngxs/store';

import { filter, map } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  getDeepestCanonicalPathTemplateFromSnapshot,
  resolveCanonicalPathFromSnapshot,
} from '@osf/shared/helpers/canonical-path.helper';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';
import { ContributorsSelectors, GetBibliographicContributors } from '@osf/shared/stores/contributors';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { GetRegistryIdentifiers, GetRegistryWithRelatedData, RegistrySelectors } from './store/registry';

@Component({
  selector: 'osf-registry',
  imports: [RouterOutlet],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column';

  private readonly metaTags = inject(MetaTagsService);
  private readonly metaTagsBuilder = inject(MetaTagsBuilderService);
  private readonly dataciteService = inject(DataciteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly helpScoutService = inject(HelpScoutService);
  private readonly prerenderReady = inject(PrerenderReadyService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly actions = createDispatchMap({
    getRegistryWithRelatedData: GetRegistryWithRelatedData,
    clearCurrentProvider: ClearCurrentProvider,
    getBibliographicContributors: GetBibliographicContributors,
    getIdentifiers: GetRegistryIdentifiers,
  });

  private readonly registryId = toSignal(this.route.params.pipe(map((params) => params['id'])));
  private readonly currentResource = select(CurrentResourceSelectors.getCurrentResource);
  private readonly registry = select(RegistrySelectors.getRegistry);
  private readonly isRegistryLoading = select(RegistrySelectors.isRegistryLoading);
  private readonly identifiersForDatacite$ = toObservable(select(RegistrySelectors.getIdentifiers)).pipe(
    map((identifiers) => (identifiers?.length ? { identifiers } : null))
  );
  private readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  private readonly isBibliographicContributorsLoading = select(
    ContributorsSelectors.isBibliographicContributorsLoading
  );
  private readonly license = select(RegistrySelectors.getLicense);
  private readonly isLicenseLoading = select(RegistrySelectors.isLicenseLoading);

  private readonly canonicalPath = signal(this.getCanonicalPathFromSnapshot());
  private readonly isFileDetailRoute = signal(this.isFileDetailRouteFromSnapshot());
  private readonly lastMetaTagsKey = signal<string | null>(null);

  private readonly allDataLoaded = computed(
    () =>
      !this.isRegistryLoading() &&
      !this.isBibliographicContributorsLoading() &&
      !this.isLicenseLoading() &&
      !!this.registry()
  );

  constructor() {
    this.prerenderReady.setNotReady();
    this.helpScoutService.setResourceType('registration');

    effect(() => {
      const id = this.registryId();

      if (id) {
        this.actions.getRegistryWithRelatedData(id);
        this.actions.getIdentifiers(id);
        this.actions.getBibliographicContributors(id, ResourceType.Registration);
      }
    });

    effect(() => {
      if (!this.allDataLoaded()) {
        this.lastMetaTagsKey.set(null);
        return;
      }

      const currentRegistryId = this.registry()?.id;
      const currentCanonicalPath = this.canonicalPath();

      if (!currentRegistryId || !currentCanonicalPath || this.isFileDetailRoute()) {
        this.lastMetaTagsKey.set(null);
        return;
      }

      const metaTagsKey = `${currentRegistryId}:${currentCanonicalPath}`;

      if (this.lastMetaTagsKey() === metaTagsKey) {
        return;
      }

      this.lastMetaTagsKey.set(metaTagsKey);
      this.setMetaTags();
    });

    this.dataciteService
      .logIdentifiableView(this.identifiersForDatacite$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.canonicalPath.set(this.getCanonicalPathFromSnapshot());
        this.isFileDetailRoute.set(this.isFileDetailRouteFromSnapshot());
        this.analyticsService.sendCountedUsageForRegistrationAndProjects(
          event.urlAfterRedirects,
          this.currentResource()
        );
      });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.actions.clearCurrentProvider();
    }

    this.helpScoutService.unsetResourceType();
  }

  private setMetaTags(): void {
    const currentRegistry = this.registry()!;

    const metaTagsData = this.metaTagsBuilder.buildRegistryMetaTagsData({
      registry: currentRegistry,
      canonicalPath: this.canonicalPath(),
      contributors: this.bibliographicContributors() ?? [],
      licenseName: this.license()?.name,
    });

    this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);
  }

  private getCanonicalPathFromSnapshot(): string {
    return resolveCanonicalPathFromSnapshot(this.route.snapshot, {
      fallbackPath: 'overview',
      paramDefaults: {
        fileProvider: 'osfstorage',
        recordId: 'osf',
      },
    });
  }

  private isFileDetailRouteFromSnapshot(): boolean {
    return getDeepestCanonicalPathTemplateFromSnapshot(this.route.snapshot) === 'files/:fileGuid';
  }
}
