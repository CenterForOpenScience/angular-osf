import { provideStore, Store } from '@ngxs/store';

import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { BannerModel } from '@core/components/osf-banners/models/banner.model';
import { BannersService } from '@osf/shared/services/banners.service';

import { GetCurrentScheduledBanner } from './banners.actions';
import { BannersSelector } from './banners.selectors';
import { BannersState } from './banners.state';

import { getScheduledBannerData } from '@testing/data/banners/scheduled.banner.data';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('State: Banners', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [provideStore([BannersState]), BannersService],
    });

    store = TestBed.inject(Store);
  });

  describe('getCurrentScheduledBanner', () => {
    it('should fetch current scheduled banner and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: BannerModel | null = null;
        store.dispatch(new GetCurrentScheduledBanner()).subscribe(() => {
          result = store.selectSnapshot(BannersSelector.getCurrentBanner);
        });

        const loading = store.selectSignal(BannersSelector.getCurrentBannerIsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne('http://localhost:8000/_/banners/current/');
        expect(request.request.method).toBe('GET');
        request.flush(getScheduledBannerData());

        expect(result).toEqual(
          Object({
            color: '#823e3e',
            defaultAltText: 'fafda',
            defaultPhoto: 'https://api.staging4.osf.io/_/banners/OSF_Banner_13.svg/',
            endDate: new Date('2025-09-30T23:59:59.999Z'),
            id: '',
            license: 'none',
            link: 'http://www.google.com',
            mobileAltText: 'afdsa',
            mobilePhoto: 'https://api.staging4.osf.io/_/banners/OSF_Banner_13.svg/',
            name: 'test',
            startDate: new Date('2025-09-01T00:00:00.000Z'),
          })
        );

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));

    it('should handle error if getCurrentScheduledBanner fails', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any = null;

        store.dispatch(new GetCurrentScheduledBanner()).subscribe({
          next: () => {
            result = 'Expected error, but got success';
          },
          error: () => {
            result = store.snapshot().banners.currentBanner;
          },
        });

        const loading = store.selectSignal(BannersSelector.getCurrentBannerIsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne('http://localhost:8000/_/banners/current/');
        expect(request.request.method).toBe('GET');
        request.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

        expect(result).toEqual({
          data: null,
          error: 'Http failure response for http://localhost:8000/_/banners/current/: 500 Server Error',
          isLoading: false,
          isSubmitting: false,
        });

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));
  });
});
