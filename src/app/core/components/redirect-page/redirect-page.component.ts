import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { timer } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WINDOW } from '@core/provider/window.provider';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource/current-resource.selectors';

@Component({
  selector: 'osf-redirect-page',
  imports: [Button, NgOptimizedImage, TranslatePipe],
  templateUrl: './redirect-page.component.html',
  styleUrl: './redirect-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectPageComponent {
  private readonly currentResource = select(CurrentResourceSelectors.getCurrentResource);
  private readonly window = inject(WINDOW);
  private readonly destroyRef = inject(DestroyRef);
  readonly redirectDelay = 5000;
  readonly redirectDestination = computed(() => this.currentResource()?.redirectUrl ?? '');

  constructor() {
    afterNextRender(() => {
      const redirectUrl = this.redirectDestination();
      if (!redirectUrl) {
        return;
      }
      timer(this.redirectDelay)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.window.location.href = this.redirectDestination();
        });
    });
  }

  goBack() {
    this.window.history.back();
  }
}
