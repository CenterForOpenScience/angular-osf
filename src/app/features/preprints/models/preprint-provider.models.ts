import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';
import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { BrandModel } from '@osf/shared/models/brand/brand.model';

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
  permissions: ReviewPermissions[];
  brand: BrandModel;
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
