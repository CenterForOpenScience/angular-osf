import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@shared/components';
import { SocialShareLinks } from '@shared/models';
import { SocialShareService } from '@shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { ShareAndDownloadComponent } from './share-and-download.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SOCIAL_SHARE_LINKS_MOCK } from '@testing/mocks/social-share-links.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ShareAndDownloadComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;
  let dataciteService: jest.Mocked<DataciteService>;
  let socialShareService: jest.Mocked<SocialShareService>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockShareLinks: SocialShareLinks = SOCIAL_SHARE_LINKS_MOCK;

  beforeEach(async () => {
    dataciteService = {
      logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
    } as any;

    socialShareService = {
      createDownloadUrl: jest.fn().mockReturnValue('https://example.com/download/preprint-1'),
      createPreprintUrl: jest.fn().mockReturnValue('https://example.com/preprint/preprint-1'),
      generateAllSharingLinks: jest.fn().mockReturnValue(mockShareLinks),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ShareAndDownloadComponent, OSFTestingModule, MockComponent(IconComponent)],
      providers: [
        TranslationServiceMock,
        MockProvider(DataciteService, dataciteService),
        MockProvider(SocialShareService, socialShareService),
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintSelectors.isPreprintLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndDownloadComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvider', mockProvider);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should return preprint loading state from store', () => {
    const loading = component.isPreprintLoading();
    expect(loading).toBe(false);
  });

  it('should compute metrics from preprint', () => {
    const metrics = component.metrics();
    expect(metrics).toBe(mockPreprint.metrics);
  });

  it('should return null metrics when no preprint', () => {
    jest.spyOn(component, 'preprint').mockReturnValue(null);
    const metrics = component.metrics();
    expect(metrics).toBeNull();
  });

  it('should compute download link from preprint', () => {
    const downloadLink = component.downloadLink();
    expect(downloadLink).toBe('https://example.com/download/preprint-1');
    expect(socialShareService.createDownloadUrl).toHaveBeenCalledWith('preprint-1');
  });

  it('should return default download link when no preprint', () => {
    jest.spyOn(component, 'preprint').mockReturnValue(null);
    const downloadLink = component.downloadLink();
    expect(downloadLink).toBe('#');
  });

  it('should return null shareable content when no preprint or provider', () => {
    jest.spyOn(component, 'preprint').mockReturnValue(null);
    const shareableContent = (component as any).shareableContent();
    expect(shareableContent).toBeNull();
  });

  it('should compute share links from shareable content', () => {
    const shareLinks = component.shareLinks();
    expect(shareLinks).toBe(mockShareLinks);
    expect(socialShareService.generateAllSharingLinks).toHaveBeenCalled();
  });

  it('should return null share links when no shareable content', () => {
    jest.spyOn(component as any, 'shareableContent').mockReturnValue(null);
    const shareLinks = component.shareLinks();
    expect(shareLinks).toBeNull();
  });

  it('should compute email share link', () => {
    const emailLink = component.emailShareLink();
    expect(emailLink).toBe(mockShareLinks.email);
  });

  it('should compute twitter share link', () => {
    const twitterLink = component.twitterShareLink();
    expect(twitterLink).toBe(mockShareLinks.twitter);
  });

  it('should compute facebook share link', () => {
    const facebookLink = component.facebookShareLink();
    expect(facebookLink).toBe(mockShareLinks.facebook);
  });

  it('should compute linkedIn share link', () => {
    const linkedInLink = component.linkedInShareLink();
    expect(linkedInLink).toBe(mockShareLinks.linkedIn);
  });

  it('should return empty string for share links when no share links', () => {
    jest.spyOn(component, 'shareLinks').mockReturnValue(null);
    expect(component.emailShareLink()).toBe('');
    expect(component.twitterShareLink()).toBe('');
    expect(component.facebookShareLink()).toBe('');
    expect(component.linkedInShareLink()).toBe('');
  });

  it('should call dataciteService.logIdentifiableDownload when logDownload is called', () => {
    component.logDownload();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
  });

  it('should handle preprint provider input', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });
});
