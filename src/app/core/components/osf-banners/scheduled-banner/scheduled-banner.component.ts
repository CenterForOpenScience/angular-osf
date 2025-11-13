import { Store } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IS_XSMALL } from '@osf/shared/helpers/breakpoints.tokens';
import { BannersSelector, GetCurrentScheduledBanner } from '@osf/shared/stores/banners';

/**
 * Component to display a scheduled banner when one is active and visible
 * based on the current time and the banner's scheduled window.
 *
 * This component is intended to show time-based promotional or informational banners
 * fetched from the store via NGXS and displayed responsively on desktop or mobile.
 *
 * - Uses `ChangeDetectionStrategy.OnPush` for performance.
 * - Observes the current screen size to adjust image and layout responsively.
 */
@Component({
  selector: 'osf-scheduled-banner',
  templateUrl: './scheduled-banner.component.html',
  styleUrls: ['./scheduled-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduledBannerComponent implements OnInit {
  /**
   * Injected NGXS Store instance used to dispatch actions and select state.
   */
  private readonly store = inject(Store);

  /**
   * Reactive signal of the currently scheduled banner fetched from the NGXS store.
   */
  currentBanner = this.store.selectSignal(BannersSelector.getCurrentBanner);

  /**
   * Signal representing whether the screen size is classified as 'extra small'.
   * Used to conditionally render mobile-optimized images or styles.
   */
  isMobile = toSignal(inject(IS_XSMALL));

  /**
   * Lifecycle hook that dispatches a store action to fetch the scheduled banner
   * when the component initializes.
   */
  ngOnInit(): void {
    this.store.dispatch(new GetCurrentScheduledBanner());
  }

  /**
   * A computed signal that determines if the current banner should be shown.
   *
   * @returns `true` if:
   * - A banner exists
   * - The current time is within the start and end time window of the banner
   *
   * Otherwise returns `false`.
   */
  shouldShowBanner = computed(() => {
    const banner = this.currentBanner();
    if (banner) {
      const bannerStartTime = banner.startDate;
      const bannerEndTime = banner.endDate;
      const currentTime = new Date();

      return bannerStartTime < currentTime && bannerEndTime > currentTime;
    }
    return false;
  });
}
