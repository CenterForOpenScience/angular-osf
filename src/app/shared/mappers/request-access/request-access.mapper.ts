import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { RequestAccessTrigger } from '@osf/shared/enums/request-access-trigger.enum';
import { RequestAccessType } from '@osf/shared/enums/request-access-type.enum';
import { RequestAccessModel } from '@shared/models/request-access/request-access.model';
import { RequestAccessDataJsonApi } from '@shared/models/request-access/request-access-json-api.model';
import { RequestAccessPayload } from '@shared/models/request-access/request-access-payload.model';

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
