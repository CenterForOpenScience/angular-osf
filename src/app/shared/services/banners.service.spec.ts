import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { BannerModel } from '@core/components/osf-banners/models/banner.model';

import { BannersService } from './banners.service';

import { getScheduledBannerData } from '@testing/data/banners/scheduled.banner.data';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Service: Banners', () => {
  let service: BannersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [BannersService],
    });

    service = TestBed.inject(BannersService);
  });

  it('should test fetchCurrentBanner', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let results: BannerModel | null = null;
    service.getCurrentBanner().subscribe({
      next: (result) => {
        results = result;
      },
    });

    const request = httpMock.expectOne('http://localhost:8000/_/banners/current');
    expect(request.request.method).toBe('GET');
    request.flush(getScheduledBannerData());

    expect(results).toEqual(
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

    expect(httpMock.verify).toBeTruthy();
  }));
});
