import { UserMapper } from '@osf/shared/mappers';
import { PaginatedData, ResponseJsonApi } from '@osf/shared/models';

import {
  PreprintProviderModerationInfo,
  PreprintRelatedCountJsonApi,
  PreprintSubmissionResponseJsonApi,
  PreprintSubmissionWithdrawalResponseJsonApi,
  PreprintWithdrawalPaginatedData,
  ReviewActionJsonApi,
} from '../models';
import { PreprintReviewActionModel } from '../models/preprint-review-action.model';
import { PreprintSubmissionPaginatedData } from '../models/preprint-submission.model';

export class PreprintModerationMapper {
  static fromResponse(response: ReviewActionJsonApi): PreprintReviewActionModel {
    const creator = UserMapper.getUserInfo(response.embeds.creator);

    return {
      id: response.id,
      dateModified: response.attributes.date_modified,
      fromState: response.attributes.from_state,
      toState: response.attributes.to_state,
      creator: {
        id: creator?.id || '',
        name: creator?.fullName || '',
      },
      preprint: {
        id: response.embeds.target.data.id,
        name: response.embeds.target.data.attributes.title,
      },
      provider: {
        id: response.embeds.provider.data.id,
        name: response.embeds.provider.data.attributes.name,
      },
    };
  }

  static fromResponseWithPagination(
    response: ResponseJsonApi<ReviewActionJsonApi[]>
  ): PaginatedData<PreprintReviewActionModel[]> {
    return {
      data: response.data.map((x) => this.fromResponse(x)),
      totalCount: response.meta.total,
      pageSize: response.meta.per_page,
    };
  }

  static fromPreprintRelatedCounts(response: PreprintRelatedCountJsonApi): PreprintProviderModerationInfo {
    return {
      id: response.id,
      name: response.attributes.name,
      reviewsCommentsAnonymous: response.attributes.reviews_comments_anonymous,
      reviewsCommentsPrivate: response.attributes.reviews_comments_private,
      reviewsWorkflow: response.attributes.reviews_workflow,
      submissionCount: response.relationships.preprints.links.related.meta.pending ?? 0,
      supportEmail: response.attributes.email_support,
    };
  }

  static fromSubmissionResponse(response: PreprintSubmissionResponseJsonApi): PreprintSubmissionPaginatedData {
    return {
      data: response.data.map((x) => ({
        id: x.id,
        title: x.attributes.title,
        public: x.attributes.public,
        reviewsState: x.attributes.reviews_state,
        actions: [],
        contributors: [],
        totalContributors: 0,
      })),
      totalCount: response.meta.total,
      pageSize: response.meta.per_page,
      pendingCount: response.meta.reviews_state_counts.pending,
      acceptedCount: response.meta.reviews_state_counts.accepted,
      rejectedCount: response.meta.reviews_state_counts.rejected,
      withdrawnCount: response.meta.reviews_state_counts.withdrawn,
    };
  }

  static fromWithdrawalSubmissionResponse(
    response: PreprintSubmissionWithdrawalResponseJsonApi
  ): PreprintWithdrawalPaginatedData {
    return {
      data: response.data.map((x) => ({
        id: x.id,
        title: x.embeds.target.data.attributes.title,
        preprintId: x.embeds.target.data.id,
        actions: [],
        contributors: [],
        totalContributors: 0,
      })),
      totalCount: response.meta.total,
      pageSize: response.meta.per_page,
      pendingCount: response.meta.requests_state_counts.pending,
      acceptedCount: response.meta.requests_state_counts.accepted,
      rejectedCount: response.meta.requests_state_counts.rejected,
    };
  }
}
