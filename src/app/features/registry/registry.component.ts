import { select } from '@ngxs/store';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { pathJoin } from '@osf/shared/helpers';
import { MetaTagsService } from '@osf/shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

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
export class RegistryComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column';

  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);
  private readonly dataciteService = inject(DataciteService);
  private readonly destroyRef = inject(DestroyRef);

  readonly registry = select(RegistryOverviewSelectors.getRegistry);
  readonly registry$ = toObservable(select(RegistryOverviewSelectors.getRegistry));

  constructor() {
    effect(() => {
      if (this.registry()) {
        this.setMetaTags();
      }
    });
    this.dataciteService.logIdentifiableView(this.registry$).subscribe();
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
      this.destroyRef
    );
  }
}
