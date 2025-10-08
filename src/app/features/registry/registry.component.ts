import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ClearCurrentProvider } from '@core/store/provider';
import { pathJoin } from '@osf/shared/helpers';
import { AnalyticsService, MetaTagsService } from '@osf/shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { GetRegistryById, RegistryOverviewSelectors } from './store/registry-overview';

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

  private readonly actions = createDispatchMap({
    getRegistryById: GetRegistryById,
    clearCurrentProvider: ClearCurrentProvider,
  });

  private registryId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  readonly registry = select(RegistryOverviewSelectors.getRegistry);
  readonly isRegistryLoading = select(RegistryOverviewSelectors.isRegistryLoading);
  readonly registry$ = toObservable(select(RegistryOverviewSelectors.getRegistry));
  readonly analyticsService = inject(AnalyticsService);

  constructor() {
    effect(() => {
      if (this.registryId()) {
        this.actions.getRegistryById(this.registryId());
      }
    });

    effect(() => {
      if (!this.isRegistryLoading() && this.registry()) {
        this.setMetaTags();
      }
    });

    effect(() => {
      const currentRegistry = this.registry();
      if (currentRegistry && currentRegistry.isPublic) {
        this.analyticsService.sendCountedUsage(currentRegistry.id, 'registry.detail').subscribe();
      }
    });

    this.dataciteService.logIdentifiableView(this.registry$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
  }

  private setMetaTags(): void {
    this.metaTags.updateMetaTags(
      {
        osfGuid: this.registry()?.id,
        title: this.registry()?.title,
        description: this.registry()?.description,
        publishedDate: this.datePipe.transform(this.registry()?.dateRegistered, 'yyyy-MM-dd'),
        modifiedDate: this.datePipe.transform(this.registry()?.dateModified, 'yyyy-MM-dd'),
        url: pathJoin(this.environment.webUrl, this.registry()?.id ?? ''),
        identifier: this.registry()?.id,
        doi: this.registry()?.doi,
        keywords: this.registry()?.tags,
        siteName: 'OSF',
        license: this.registry()?.license?.name,
        contributors:
          this.registry()?.contributors?.map((contributor) => ({
            fullName: contributor.fullName,
            givenName: contributor.givenName,
            familyName: contributor.familyName,
          })) ?? [],
      },
      this.destroyRef
    );
  }
}
