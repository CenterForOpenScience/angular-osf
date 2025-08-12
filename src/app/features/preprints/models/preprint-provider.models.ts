import { StringOrNull } from '@core/helpers';
import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums/provider-reviews-workflow.enum';
import { ReviewPermissions } from '@shared/enums/review-permissions.enum';
import { Brand } from '@shared/models';

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
