import { MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SocialShareService } from '@osf/shared/services/social-share.service';

import { PreprintDownloadRedirectComponent } from './preprint-download-redirect.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

const MOCK_ID = 'test-preprint-id';
const MOCK_DOWNLOAD_URL = 'https://osf.io/download/test-preprint-id';

describe('PreprintDownloadRedirectComponent', () => {
  let locationReplaceMock: jest.Mock;

  beforeEach(() => {
    locationReplaceMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: locationReplaceMock },
      writable: true,
      configurable: true,
    });
  });

  function setup(overrides: { id?: string | null; isBrowser?: boolean } = {}) {
    const { id = MOCK_ID, isBrowser = true } = overrides;

    const mockRoute = ActivatedRouteMockBuilder.create()
      .withParams(id ? { id } : {})
      .build();

    const mockSocialShareService = {
      createDownloadUrl: jest.fn().mockReturnValue(MOCK_DOWNLOAD_URL),
    };

    TestBed.configureTestingModule({
      imports: [PreprintDownloadRedirectComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(SocialShareService, mockSocialShareService),
        MockProvider(PLATFORM_ID, isBrowser ? 'browser' : 'server'),
      ],
    });

    const fixture = TestBed.createComponent(PreprintDownloadRedirectComponent);
    return { fixture, component: fixture.componentInstance, mockSocialShareService };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should render download message', () => {
    const { fixture } = setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('preprints.downloadRedirect.message');
  });

  it('should redirect to download URL when id is present in browser', () => {
    const { mockSocialShareService } = setup({ id: MOCK_ID });
    expect(mockSocialShareService.createDownloadUrl).toHaveBeenCalledWith(MOCK_ID);
    expect(locationReplaceMock).toHaveBeenCalledWith(MOCK_DOWNLOAD_URL);
  });

  it('should not redirect when id is missing', () => {
    const { mockSocialShareService } = setup({ id: null });
    expect(mockSocialShareService.createDownloadUrl).not.toHaveBeenCalled();
    expect(locationReplaceMock).not.toHaveBeenCalled();
  });

  it('should not redirect when not in browser', () => {
    const { mockSocialShareService } = setup({ isBrowser: false });
    expect(mockSocialShareService.createDownloadUrl).not.toHaveBeenCalled();
    expect(locationReplaceMock).not.toHaveBeenCalled();
  });
});
