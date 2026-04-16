import { Pipe, PipeTransform } from '@angular/core';

import { CollectionSubmissionReviewState } from '../enums/collection-submission-review-state.enum';
import { COLLECTION_SUBMISSION_STATUS_SEVERITY } from '../helpers/collection-submission-status.util';
import { CustomOption } from '../models/select-option.model';
import { TagSeverityType } from '../models/severity.type';

@Pipe({
  name: 'collectionStatusSeverity',
})
export class CollectionStatusSeverityPipe implements PipeTransform {
  transform(status: CollectionSubmissionReviewState): CustomOption<TagSeverityType> {
    return COLLECTION_SUBMISSION_STATUS_SEVERITY[status];
  }
}
