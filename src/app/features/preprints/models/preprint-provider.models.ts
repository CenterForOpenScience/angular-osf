import { StringOrNull } from '@core/helpers';
import { Brand } from '@shared/models';

export interface PreprintProviderDetails {
  id: string;
  name: string;
  descriptionHtml: string;
  advisoryBoardHtml: StringOrNull;
  examplePreprintId: string;
  domain: string;
  footerLinksHtml: string;
  preprintWord: string;
  allowSubmissions: boolean;
  assertionsEnabled: boolean;
  reviewsWorkflow: StringOrNull;
  brand: Brand;
  lastFetched?: number;
  iri: string;
  faviconUrl: string;
  squareColorNoTransparentImageUrl: string;
}

export interface PreprintProviderShortInfo {
  id: string;
  name: string;
  descriptionHtml: string;
  whiteWideImageUrl: string;
  squareColorNoTransparentImageUrl: string;
  submissionCount?: number;
}
