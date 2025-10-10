import { PreprintRequestAction, PreprintRequestActionDataJsonApi } from '@osf/features/preprints/models';
import { UserMapper } from '@osf/shared/mappers';
import { StringOrNull } from '@shared/helpers';

export class PreprintRequestActionsMapper {
  static fromPreprintRequestActions(data: PreprintRequestActionDataJsonApi): PreprintRequestAction {
    const creator = UserMapper.getUserInfo(data.embeds.creator);

    return {
      id: data.id,
      trigger: data.attributes.trigger,
      comment: data.attributes.comment,
      fromState: data.attributes.from_state,
      toState: data.attributes.to_state,
      dateModified: data.attributes.date_modified,
      creator: {
        id: creator?.id || '',
        name: creator?.fullName || '',
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
