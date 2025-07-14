import { JsonApiResponseWithPaging } from '@osf/core/models';
import { PaginatedData } from '@osf/shared/models';

import { ReviewActionJsonApi } from '../models';
import { PreprintReviewActionModel } from '../models/preprint-review-action.model';

export class PreprintReviewActionMapper {
  static fromResponse(response: ReviewActionJsonApi): PreprintReviewActionModel {
    return {
      id: response.id,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      fromState: response.attributes.from_state,
      toState: response.attributes.to_state,
      trigger: response.attributes.trigger,
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
}
