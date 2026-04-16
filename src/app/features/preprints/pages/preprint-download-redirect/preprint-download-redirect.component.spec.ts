import { MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SocialShareService } from '@osf/shared/services/social-share.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { PreprintDownloadRedirectComponent } from './preprint-download-redirect.component';

const MOCK_ID = 'test-preprint-id';
const MOCK_DOWNLOAD_URL = 'https://osf.io/download/test-preprint-id';

describe('PreprintDownloadRedirectComponent', () => {
  function setup(overrides: { id?: string | null; isBrowser?: boolean } = {}) {
    const { id = null, isBrowser = true } = overrides;

    const mockRoute = ActivatedRouteMockBuilder.create()
      .withParams(id ? { id } : {})
      .build();

    const mockSocialShareService = {
      createDownloadUrl: vi.fn().mockReturnValue(MOCK_DOWNLOAD_URL),
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
    const redirectSpy = vi.spyOn(PreprintDownloadRedirectComponent.prototype, 'redirect').mockImplementation(vi.fn());
    const { mockSocialShareService } = setup({ id: MOCK_ID });
    expect(mockSocialShareService.createDownloadUrl).toHaveBeenCalledWith(MOCK_ID);
    expect(redirectSpy).toHaveBeenCalledWith(MOCK_DOWNLOAD_URL);
    redirectSpy.mockRestore();
  });

  it('should not redirect when id is missing', () => {
    const redirectSpy = vi.spyOn(PreprintDownloadRedirectComponent.prototype, 'redirect').mockImplementation(vi.fn());
    const { mockSocialShareService } = setup({ id: null });
    expect(mockSocialShareService.createDownloadUrl).not.toHaveBeenCalled();
    expect(redirectSpy).not.toHaveBeenCalled();
    redirectSpy.mockRestore();
  });

  it('should not redirect when not in browser', () => {
    const redirectSpy = vi.spyOn(PreprintDownloadRedirectComponent.prototype, 'redirect').mockImplementation(vi.fn());
    const { mockSocialShareService } = setup({ isBrowser: false });
    expect(mockSocialShareService.createDownloadUrl).not.toHaveBeenCalled();
    expect(redirectSpy).not.toHaveBeenCalled();
    redirectSpy.mockRestore();
  });
});
