import { Store } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IS_XSMALL } from '@osf/shared/helpers';
import { BannersSelector, FetchCurrentScheduledBanner } from '@osf/shared/stores/banners';

@Component({
  selector: 'osf-scheduled-banner',
  templateUrl: './scheduled-banner.component.html',
  styleUrl: './scheduled-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduledBannerComponent implements OnInit {
  private readonly store = inject(Store);
  protected currentBanner = this.store.selectSignal(BannersSelector.getCurrentBanner);
  protected isMobile = toSignal(inject(IS_XSMALL));

  ngOnInit() {
    this.store.dispatch(new FetchCurrentScheduledBanner());
  }

  shouldShowBanner() {
    const bannerStartTime = this.currentBanner().data.startDate;
    const bannderEndTime = this.currentBanner().data.endDate;
    const currentTime = new Date();
    return bannerStartTime < currentTime && bannderEndTime > currentTime;
  }
}
