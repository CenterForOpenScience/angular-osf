import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { SOCIAL_PLATFORMS } from '../constants/social-platforms.const';
import { SOCIAL_SHARE_URLS } from '../constants/social-share.config';
import { SocialShareContentModel } from '../models/socials/social-share-content.model';

import { SocialShareService } from './social-share.service';

describe('SocialShareService', () => {
  let service: SocialShareService;

  const content: SocialShareContentModel = {
    title: 'My Title',
    url: 'https://osf.io/abcd1',
  };

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        SocialShareService,
        MockProvider(ENVIRONMENT, {
          webUrl: 'https://osf.test',
          facebookAppId: 'fb-app-id',
        }),
      ],
    });

    service = TestBed.inject(SocialShareService);
  }

  it('should create', () => {
    setup();
    expect(service).toBeTruthy();
  });

  it('should build email share link', () => {
    setup();
    const link = service.getEmailLink(content.title, content.url);
    expect(link).toBe(
      `${SOCIAL_SHARE_URLS.email}?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(content.url)}`
    );
  });

  it('should build x share link', () => {
    setup();
    const link = service.getXLink(content.title, content.url);
    expect(link).toBe(
      `${SOCIAL_SHARE_URLS.x.preview_url}?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.title)}&via=${SOCIAL_SHARE_URLS.x.viaHandle}`
    );
  });

  it('should build facebook links', () => {
    setup();
    const link = service.getFacebookLink(content.url);
    const custom = service.getFacebookCustomLink(content.url);

    expect(link).toBe(`${SOCIAL_SHARE_URLS.facebook}?u=${encodeURIComponent(content.url)}`);
    expect(custom).toBe(
      `${SOCIAL_SHARE_URLS.facebookShare}?app_id=fb-app-id&display=popup&href=${encodeURIComponent(content.url)}&redirect_uri=${encodeURIComponent(content.url)}`
    );
  });

  it('should generate all sharing links', () => {
    setup();
    const links = service.generateAllSharingLinks(content);

    expect(links.email).toContain('mailto:');
    expect(links.twitter).toContain(SOCIAL_SHARE_URLS.x.preview_url);
    expect(links.facebook).toContain(SOCIAL_SHARE_URLS.facebook);
    expect(links.linkedIn).toContain(SOCIAL_SHARE_URLS.linkedIn);
    expect(links.mastodon).toContain(SOCIAL_SHARE_URLS.mastodon);
    expect(links.bluesky).toContain(SOCIAL_SHARE_URLS.bluesky);
  });

  it('should create web urls', () => {
    setup();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    expect(service.createPreprintUrl('pp-1', 'osf')).toBe('https://osf.test/preprints/osf/pp-1');
    expect(service.createGuidUrl('abc12')).toBe('https://osf.test/abc12');
    expect(service.createDownloadUrl('res-1')).toBe(
      `https://osf.test/download/res-1?source=&tz=${encodeURIComponent(timeZone)}`
    );
  });

  it('should generate social action items from platform config', () => {
    setup();
    const items = service.generateSocialActionItems(content);

    expect(items.length).toBe(SOCIAL_PLATFORMS.length);
    expect(items[0].label).toBe(SOCIAL_PLATFORMS[0].label);
    expect(items[0].icon).toBe(SOCIAL_PLATFORMS[0].icon);
    expect(items[0].url).toContain('mailto:');
  });
});
