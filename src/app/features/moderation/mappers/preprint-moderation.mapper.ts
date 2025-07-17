import { JsonApiResponseWithPaging } from '@osf/core/models';
import { PaginatedData } from '@osf/shared/models';

import { PreprintProviderModerationInfo, PreprintRelatedCountJsonApi, ReviewActionJsonApi } from '../models';
import { PreprintReviewActionModel } from '../models/preprint-review-action.model';

export class PreprintModerationMapper {
  static fromResponse(response: ReviewActionJsonApi): PreprintReviewActionModel {
    return {
      id: response.id,
      dateModified: response.attributes.date_modified,
      fromState: response.attributes.from_state,
      toState: response.attributes.to_state,
      creator: {
        id: response.embeds.creator.data.id,
        name: response.embeds.creator.data.attributes.full_name,
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
    response: JsonApiResponseWithPaging<ReviewActionJsonApi[], null>
  ): PaginatedData<PreprintReviewActionModel[]> {
    return {
      data: response.data.map((x) => this.fromResponse(x)),
      totalCount: response.links.meta.total,
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
}
