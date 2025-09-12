import { select, Store } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IS_XSMALL } from '@osf/shared/helpers';
import { BannersSelector, FetchCurrentScheduledBanner } from '@osf/shared/stores/banners';

@Component({
  selector: 'osf-scheduled-banner',
  templateUrl: './scheduled-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduledBannerComponent implements OnInit {
  private readonly store = inject(Store);
  currentBanner = select(BannersSelector.getCurrentBanner);
  isMobile = toSignal(inject(IS_XSMALL));

  ngOnInit() {
    this.store.dispatch(new FetchCurrentScheduledBanner());
  }

  shouldShowBanner = computed(() => {
    const banner = this.currentBanner();
    if (banner) {
      const bannerStartTime = banner.startDate;
      const bannderEndTime = banner.endDate;
      const currentTime = new Date();
      return bannerStartTime < currentTime && bannderEndTime > currentTime;
    }
    return false;
  });
}
