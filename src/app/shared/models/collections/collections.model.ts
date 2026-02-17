import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';

import { BrandModel } from '../brand/brand.model';
import { ContributorModel } from '../contributors/contributor.model';
import { ProjectModel } from '../projects/projects.model';
import { BaseProviderModel } from '../provider/provider.model';

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
  brand: BrandModel | null;
}

export interface CollectionFilters {
  collectedType: string[];
  disease: string[];
  dataType: string[];
  gradeLevels: string[];
  issue: string[];
  programArea: string[];
  schoolType: string[];
  status: string[];
  studyDesign: string[];
  volume: string[];
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
  reviewsState: CollectionSubmissionReviewState;
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
  reviewsState: CollectionSubmissionReviewState;
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
  contributors?: ContributorModel[];
  creator?: {
    id: string;
    fullName: string;
  };
  actions?: CollectionSubmissionReviewAction[];
  totalContributors?: number;
  contributorsLoading?: boolean;
  contributorsPage?: number;
}

export interface CollectionProjectSubmission {
  submission: CollectionSubmissionWithGuid;
  project: ProjectModel;
}

export type CollectionSubmissionActionType = 'collection_submission_actions';

export type CollectionSubmissionTargetType = 'collection-submissions';
