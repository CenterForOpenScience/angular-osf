import { MockComponent, MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { SocialShareService } from '@osf/shared/services/social-share.service';

import { ShareAndDownloadComponent } from './share-and-download.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { DataciteServiceMockBuilder, DataciteServiceMockType } from '@testing/providers/datacite.service.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

describe('ShareAndDownloadComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;
  let dataciteService: DataciteServiceMockType;
  let socialShareService: { createDownloadUrl: jest.Mock };

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;

  interface SetupOverrides extends BaseSetupOverrides {
    platformId?: string;
  }

  function setup(overrides: SetupOverrides = {}) {
    dataciteService = DataciteServiceMockBuilder.create().build();
    socialShareService = { createDownloadUrl: jest.fn().mockReturnValue('https://example.com/download') };

    TestBed.configureTestingModule({
      imports: [ShareAndDownloadComponent, MockComponent(SocialsShareButtonComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(PLATFORM_ID, overrides.platformId ?? 'browser'),
        MockProvider(DataciteService, dataciteService),
        MockProvider(SocialShareService, socialShareService),
        provideMockStore({
          signals: mergeSignalOverrides(
            [{ selector: PreprintSelectors.getPreprint, value: mockPreprint }],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(ShareAndDownloadComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvider', mockProvider);
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should return preprint from store', () => {
    setup();
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should handle preprint provider input', () => {
    setup();
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should open download link and log identifiable download', () => {
    setup();
    const focus = jest.fn();
    const openSpy = jest.spyOn(window, 'open').mockReturnValue({ focus } as unknown as Window);

    component.download();

    expect(socialShareService.createDownloadUrl).toHaveBeenCalledWith(mockPreprint.id);
    expect(openSpy).toHaveBeenCalledWith('https://example.com/download');
    expect(focus).toHaveBeenCalled();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
    openSpy.mockRestore();
  });

  it('should not do anything when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: null }],
    });
    const openSpy = jest.spyOn(window, 'open');

    component.download();

    expect(socialShareService.createDownloadUrl).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    expect(dataciteService.logIdentifiableDownload).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('should not open or log when not running in browser', () => {
    setup({ platformId: 'server' });
    const openSpy = jest.spyOn(window, 'open');

    component.download();

    expect(socialShareService.createDownloadUrl).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    expect(dataciteService.logIdentifiableDownload).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('should not log when window.open fails', () => {
    setup();
    const openSpy = jest.spyOn(window, 'open').mockReturnValue(null);

    component.download();

    expect(socialShareService.createDownloadUrl).toHaveBeenCalledWith(mockPreprint.id);
    expect(dataciteService.logIdentifiableDownload).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
