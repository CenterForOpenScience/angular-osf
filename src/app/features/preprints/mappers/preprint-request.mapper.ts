import { PreprintRequestType } from '@osf/features/preprints/enums';
import { PreprintRequest, PreprintRequestDataJsonApi } from '@osf/features/preprints/models';

export class PreprintRequestMapper {
  static toWithdrawPreprintPayload(preprintId: string, justification: string) {
    return {
      data: {
        type: 'preprint_requests',
        attributes: {
          comment: justification,
          request_type: PreprintRequestType.Withdrawal,
        },
        relationships: {
          target: {
            data: {
              type: 'preprints',
              id: preprintId,
            },
          },
        },
      },
    };
  }

  static fromPreprintRequest(data: PreprintRequestDataJsonApi): PreprintRequest {
    return {
      id: data.id,
      comment: data.attributes.comment,
      requestType: data.attributes.request_type,
      machineState: data.attributes.machine_state,
      dateLastTransitioned: data.attributes.date_last_transitioned,
      creator: {
        id: data.embeds.creator.data.id,
        name: data.embeds.creator.data.attributes.full_name,
      },
    };
  }
}
