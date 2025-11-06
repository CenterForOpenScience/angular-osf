import { createDispatchMap, select } from '@ngxs/store';

import { map, of, tap } from 'rxjs';

import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LoaderService } from '@osf/shared/services/loader.service';
import { GetWikiList, WikiSelectors } from '@osf/shared/stores/wiki';

@Component({
  template: '',
})
export class LegacyWikiRedirectComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);

  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  wikiList = select(WikiSelectors.getWikiList);

  actions = createDispatchMap({ getWikiList: GetWikiList });

  constructor() {
    this.loaderService.show();
    this.redirectWiki();
  }

  redirectWiki() {
    const params = this.route.snapshot.params;
    const wikiName = params['wikiName'];

    this.actions
      .getWikiList(ResourceType.Project, this.projectId())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          const wikiGUID = this.wikiList().find((item) => item.name === wikiName)?.id ?? null;
          this.router.navigate([`/${this.projectId()}/wiki`], {
            queryParams: { wiki: wikiGUID },
            replaceUrl: true,
          });
          this.loaderService.hide();
        })
      )
      .subscribe();
  }
}
