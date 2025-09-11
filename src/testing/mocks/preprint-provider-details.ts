import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { ReviewPermissions } from '@shared/enums';

export const PREPRINT_PROVIDER_DETAILS_MOCK: PreprintProviderDetails = {
  id: 'osf-preprints',
  name: 'OSF Preprints',
  descriptionHtml: '<p>Open preprints for all disciplines</p>',
  advisoryBoardHtml: '<p>Advisory board content here</p>',
  examplePreprintId: '12345',
  domain: 'osf.io',
  footerLinksHtml: '<a href="/about">About</a>',
  preprintWord: 'preprint',
  allowSubmissions: true,
  assertionsEnabled: false,
  reviewsWorkflow: ProviderReviewsWorkflow.PreModeration,
  permissions: [ReviewPermissions.ViewSubmissions],
  brand: {
    id: 'brand-1',
    name: 'OSF Brand',
    heroLogoImageUrl: 'https://osf.io/assets/hero-logo.png',
    heroBackgroundImageUrl: 'https://osf.io/assets/hero-bg.png',
    topNavLogoImageUrl: 'https://osf.io/assets/nav-logo.png',
    primaryColor: '#0056b3',
    secondaryColor: '#ff9900',
    backgroundColor: '#ffffff',
  },
  iri: 'https://osf.io/preprints/',
  faviconUrl: 'https://osf.io/favicon.ico',
  squareColorNoTransparentImageUrl: 'https://osf.io/image.png',
  facebookAppId: '1234567890',
  reviewsCommentsPrivate: null,
  reviewsCommentsAnonymous: null,
  lastFetched: Date.now(),
};
