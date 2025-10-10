import { ContributorPermission, RequestAccessTrigger, RequestAccessType } from '@osf/shared/enums';
import { RequestAccessDataJsonApi, RequestAccessModel, RequestAccessPayload } from '@osf/shared/models';

import { UserMapper } from '../user';

export class RequestAccessMapper {
  static getRequestAccessList(data: RequestAccessDataJsonApi[]): RequestAccessModel[] {
    if (!data) {
      return [];
    }

    return data.map((item) => this.getRequestAccessItem(item));
  }

  static getRequestAccessItem(data: RequestAccessDataJsonApi): RequestAccessModel {
    const attributes = data.attributes;
    const creator = UserMapper.getUserInfo(data.embeds.creator);

    return {
      id: data.id,
      requestType: attributes.machine_state,
      machineState: attributes.machine_state,
      comment: attributes.comment,
      created: attributes.created,
      modified: attributes.modified,
      dateLastTransitioned: attributes.date_last_transitioned,
      requestedPermissions: attributes.requested_permissions || ContributorPermission.Read,
      creator: creator,
      isBibliographic: attributes.request_type == RequestAccessType.Access,
      isCurator: attributes.request_type === RequestAccessType.InstitutionalRequest,
    };
  }

  static convertToRequestAccessAction(id: string, trigger: RequestAccessTrigger, payload?: RequestAccessPayload) {
    return {
      data: {
        attributes: {
          trigger,
          permissions: payload?.permissions,
          visible: true,
        },
        relationships: {
          target: {
            data: {
              type: 'node-requests',
              id,
            },
          },
        },
        type: 'node-request-actions',
      },
    };
  }
}
