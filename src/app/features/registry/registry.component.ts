import { select } from '@ngxs/store';

import { filter, map, Observable } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostBinding, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { pathJoin } from '@osf/shared/helpers';
import { MetaTagsService } from '@osf/shared/services';
import { DataciteTrackerComponent } from '@shared/components/datacite-tracker/datacite-tracker.component';

import { RegistryOverviewSelectors } from './store/registry-overview';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-registry',
  imports: [RouterOutlet],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class RegistryComponent extends DataciteTrackerComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column';

  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);

  protected readonly registry = select(RegistryOverviewSelectors.getRegistry);
  readonly registry$ = toObservable(select(RegistryOverviewSelectors.getRegistry));

  constructor() {
    super();
    effect(() => {
      if (this.registry()) {
        this.setMetaTags();
      }
    });
    this.setupDataciteViewTrackerEffect().subscribe();
  }

  protected getDoi(): Observable<string | null> {
    return this.registry$.pipe(
      filter((project) => project != null),
      map((project) => project?.identifiers?.find((item) => item.category == 'doi')?.value ?? null)
    );
  }

  private setMetaTags(): void {
    const image = 'engines-dist/registries/assets/img/osf-sharing.png';

    this.metaTags.updateMetaTagsForRoute(
      {
        title: this.registry()?.title,
        description: this.registry()?.description,
        publishedDate: this.datePipe.transform(this.registry()?.dateRegistered, 'yyyy-MM-dd'),
        modifiedDate: this.datePipe.transform(this.registry()?.dateModified, 'yyyy-MM-dd'),
        url: pathJoin(environment.webUrl, this.registry()?.id ?? ''),
        image,
        identifier: this.registry()?.id,
        doi: this.registry()?.doi,
        keywords: this.registry()?.tags,
        siteName: 'OSF',
        license: this.registry()?.license?.name,
        contributors: this.registry()?.contributors.map((contributor) => ({
          givenName: contributor.givenName,
          familyName: contributor.familyName,
        })),
      },
      'registries'
    );
  }
}
