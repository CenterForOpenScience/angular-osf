import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';

import { Brand } from '../brand.model';
import { ContributorShortInfoModel } from '../contributors';
import { BaseProviderModel } from '../provider';

export interface CollectionProvider extends BaseProviderModel {
  assets: {
    style?: string;
    squareColorTransparent?: string;
    squareColorNoTransparent?: string;
    favicon?: string;
  };
  primaryCollection: {
    id: string;
    type: string;
  };
  brand: Brand | null;
}

export interface CollectionFilters {
  status: string[];
  collectedType: string[];
  volume: string[];
  issue: string[];
  programArea: string[];
  schoolType: string[];
  studyDesign: string[];
  dataType: string[];
  disease: string[];
  gradeLevels: string[];
}

export interface CollectionDetails {
  id: string;
  type: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  bookmarks: boolean;
  isPromoted: boolean;
  isPublic: boolean;
  filters: CollectionFilters;
}

export interface CollectionSubmission {
  id: string;
  type: string;
  collectionTitle: string;
  collectionId: string;
  reviewsState: string;
  collectedType: string;
  status: string;
  volume: string;
  issue: string;
  programArea: string;
  schoolType: string;
  studyDesign: string;
  dataType: string;
  disease: string;
  gradeLevels: string;
}

export interface CollectionSubmissionWithGuid {
  id: string;
  type: string;
  nodeId: string;
  nodeUrl: string;
  title: string;
  description: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  public: boolean;
  reviewsState: string;
  collectedType: string;
  status: string;
  volume: string;
  issue: string;
  programArea: string;
  schoolType: string;
  studyDesign: string;
  dataType: string;
  disease: string;
  gradeLevels: string;
  contributors?: ContributorShortInfoModel[];
  creator?: {
    id: string;
    fullName: string;
  };
  actions?: CollectionSubmissionReviewAction[];
}

export type CollectionSubmissionActionType = 'collection_submission_actions';

export type CollectionSubmissionTargetType = 'collection-submissions';
