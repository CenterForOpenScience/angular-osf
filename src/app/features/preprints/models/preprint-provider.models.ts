import { StringOrNull } from '@osf/shared/helpers';
import { Brand } from '@osf/shared/models';

import { ProviderReviewsWorkflow } from '../enums';

export type PreprintWord = 'default' | 'work' | 'paper' | 'preprint' | 'thesis';
export type PreprintWordGrammar = 'plural' | 'pluralCapitalized' | 'singular' | 'singularCapitalized';

export interface PreprintProviderDetails {
  id: string;
  name: string;
  descriptionHtml: string;
  advisoryBoardHtml: StringOrNull;
  examplePreprintId: string;
  domain: string;
  footerLinksHtml: string;
  preprintWord: PreprintWord;
  allowSubmissions: boolean;
  assertionsEnabled: boolean;
  reviewsWorkflow: ProviderReviewsWorkflow | null;
  brand: Brand;
  lastFetched?: number;
  iri: string;
  faviconUrl: string;
  squareColorNoTransparentImageUrl: string;
  facebookAppId: StringOrNull;
  reviewsCommentsPrivate: StringOrNull;
  reviewsCommentsAnonymous: StringOrNull;
}

export interface PreprintProviderShortInfo {
  id: string;
  name: string;
  descriptionHtml: string;
  whiteWideImageUrl: string;
  squareColorNoTransparentImageUrl: string;
  submissionCount?: number;
}
