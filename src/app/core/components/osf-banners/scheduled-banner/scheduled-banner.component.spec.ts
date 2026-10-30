import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerModel } from '@core/components/osf-banners/models/banner.model';
import { IS_XSMALL } from '@osf/shared/helpers/breakpoints.tokens';
import { BannersSelector, GetCurrentScheduledBanner } from '@osf/shared/stores/banners';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ScheduledBannerComponent } from './scheduled-banner.component';

describe('Component: Scheduled Banner', () => {
  let fixture: ComponentFixture<ScheduledBannerComponent>;
  let store: Store;
  let component: ScheduledBannerComponent;

  const currentBannerSignal: WritableSignal<BannerModel | null> = signal<BannerModel | null>(null);
  let isMobile$: BehaviorSubject<boolean>;

  function setup(overrides: { isBrowser?: boolean } = {}) {
    isMobile$ = new BehaviorSubject<boolean>(false);
    currentBannerSignal.set(null);

    TestBed.configureTestingModule({
      imports: [ScheduledBannerComponent],
      providers: [
        provideOSFCore(),
        MockProvider(IS_XSMALL, isMobile$),
        MockProvider(PLATFORM_ID, overrides.isBrowser === false ? 'server' : 'browser'),
        provideMockStore({
          signals: [{ selector: BannersSelector.getCurrentBanner, value: currentBannerSignal }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ScheduledBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create the component', () => {
    setup();
    expect(component).toBeInstanceOf(ScheduledBannerComponent);
  });

  it('should dispatch GetCurrentScheduledBanner on init in browser', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new GetCurrentScheduledBanner());
  });

  it('should not dispatch GetCurrentScheduledBanner on server', () => {
    setup({ isBrowser: false });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return false if no banner is set', () => {
    setup();
    currentBannerSignal.set(null);
    expect(component.shouldShowBanner()).toBe(false);
  });

  it('should return true if current time is within banner window', () => {
    setup();
    const showBanner = component.shouldShowBanner;
    expect(showBanner()).toBeFalsy();

    const now = new Date();
    currentBannerSignal.set(
      Object({
        color: '#123456',
        link: '',
        defaultPhoto: '',
        defaultAltText: '',
        mobilePhoto: '',
        mobileAltText: '',
        startDate: new Date(now.getTime() - 5000),
        endDate: new Date(now.getTime() + 5000),
      })
    );

    fixture.detectChanges();
    expect(showBanner()).toBeTruthy();
    const parent = fixture.nativeElement.querySelector('[data-test-banner-parent]');
    const link = fixture.nativeElement.querySelector('[data-test-banner-href]');
    expect(parent.style.backgroundColor).toBe('rgb(18, 52, 86)');
    expect(link.getAttribute('href')).toBe('');
  });

  it('should return false if current time is outside the banner window', () => {
    setup();
    const now = new Date();
    currentBannerSignal.set(
      Object({
        startDate: new Date(now.getTime() - 2000),
        endDate: new Date(now.getTime() - 1000),
      })
    );
    fixture.detectChanges();
    const parent = fixture.nativeElement.querySelector('[data-test-banner-parent]');
    const link = fixture.nativeElement.querySelector('[data-test-banner-href]');

    expect(component.shouldShowBanner()).toBe(false);
    expect(parent).toBeNull();
    expect(link).toBeNull();
  });

  it('should reflect the isMobile signal', () => {
    setup();
    const now = new Date();
    currentBannerSignal.set(
      Object({
        color: '#123456',
        link: '',
        defaultPhoto: 'default.jpg',
        defaultAltText: 'default alt',
        mobilePhoto: 'mobile.jpg',
        mobileAltText: 'mobile alt',
        startDate: new Date(now.getTime() - 5000),
        endDate: new Date(now.getTime() + 5000),
      })
    );
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector('[data-test-banner-image]');

    expect(image.getAttribute('src')).toBe('default.jpg');
    expect(image.getAttribute('alt')).toBe('default alt');
    expect(component.isMobile()).toBe(false);

    isMobile$.next(true);
    fixture.detectChanges();
    expect(image.getAttribute('src')).toBe('mobile.jpg');
    expect(image.getAttribute('alt')).toBe('mobile alt');
    expect(component.isMobile()).toBe(true);

    isMobile$.next(false);
    fixture.detectChanges();
    expect(image.getAttribute('src')).toBe('default.jpg');
    expect(image.getAttribute('alt')).toBe('default alt');
    expect(component.isMobile()).toBe(false);
  });
});
