import { createDispatchMap } from '@ngxs/store';

import { filter } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { GetCurrentUser } from '@core/store/user';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';
import { MetaTagsService } from './shared/services/meta-tags.service';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet, ToastComponent, FullScreenLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  actions = createDispatchMap({
    getCurrentUser: GetCurrentUser,
  });

  constructor(
    private router: Router,
    private metaTagsService: MetaTagsService
  ) {
    this.setupMetaTagsCleanup();
  }

  ngOnInit(): void {
    this.actions.getCurrentUser();
  }

  private setupMetaTagsCleanup(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => this.metaTagsService.clearMetaTagsIfNeeded(event.url));
  }
}
