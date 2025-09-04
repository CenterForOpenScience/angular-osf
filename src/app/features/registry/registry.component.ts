import { select } from '@ngxs/store';

import { Observable } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { pathJoin } from '@osf/shared/helpers';
import { MetaTagsService } from '@osf/shared/services';
import { DataciteTrackerComponent } from '@shared/components/datacite-tracker/datacite-tracker.component';
import { Identifier } from '@shared/models';

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
  private readonly destroyRef = inject(DestroyRef);

  readonly registry = select(RegistryOverviewSelectors.getRegistry);
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

  protected override get trackable(): Observable<{ identifiers?: Identifier[] } | null> {
    return this.registry$;
  }

  private setMetaTags(): void {
    this.metaTags.updateMetaTags(
      {
        title: this.registry()?.title,
        description: this.registry()?.description,
        publishedDate: this.datePipe.transform(this.registry()?.dateRegistered, 'yyyy-MM-dd'),
        modifiedDate: this.datePipe.transform(this.registry()?.dateModified, 'yyyy-MM-dd'),
        url: pathJoin(environment.webUrl, this.registry()?.id ?? ''),
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
      this.destroyRef,
    );
  }
}
