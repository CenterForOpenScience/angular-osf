import { PreprintRequestAction, PreprintRequestActionDataJsonApi } from '@osf/features/preprints/models';
import { StringOrNull } from '@shared/helpers';

export class PreprintRequestActionsMapper {
  static fromPreprintRequestActions(data: PreprintRequestActionDataJsonApi): PreprintRequestAction {
    return {
      id: data.id,
      trigger: data.attributes.trigger,
      comment: data.attributes.comment,
      fromState: data.attributes.from_state,
      toState: data.attributes.to_state,
      dateModified: data.attributes.date_modified,
      creator: {
        id: data.embeds.creator.data.id,
        name: data.embeds.creator.data.attributes.full_name,
      },
    };
  }

  static toRequestActionPayload(requestId: string, trigger: string, comment: StringOrNull) {
    return {
      data: {
        type: 'preprint_request_actions',
        attributes: {
          trigger,
          ...(comment && { comment }),
        },
        relationships: {
          target: {
            data: {
              type: 'preprint-requests',
              id: requestId,
            },
          },
        },
      },
    };
  }
}
