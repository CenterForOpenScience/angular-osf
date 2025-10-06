import { ContributorPermission, RequestAccessTrigger } from '@osf/shared/enums';
import {
  ContributorModel,
  RequestAccessDataJsonApi,
  RequestAccessModel,
  RequestAccessPayload,
} from '@osf/shared/models';

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

    return {
      id: data.id,
      requestType: attributes.machine_state,
      machineState: attributes.machine_state,
      comment: attributes.comment,
      created: attributes.created,
      modified: attributes.modified,
      dateLastTransitioned: attributes.date_last_transitioned,
      requestedPermissions: attributes.requested_permissions,
      creator: UserMapper.fromUserGetResponse(data.embeds.creator.data),
    };
  }

  static convertToContributorModels(data: RequestAccessDataJsonApi[]): ContributorModel[] {
    return data.map((item, index) => this.convertToContributorModel(item, index));
  }

  static convertToContributorModel(data: RequestAccessDataJsonApi, index: number): ContributorModel {
    const userData = data.embeds.creator.data;
    const attributes = data.attributes;

    return {
      id: data.id,
      type: data.type,
      isBibliographic: true,
      isUnregisteredContributor: false,
      isCurator: false,
      permission: attributes.requested_permissions || ContributorPermission.Read,
      index: index,
      userId: userData.id || '',
      fullName: userData?.attributes?.full_name || '',
      givenName: userData?.attributes?.given_name || '',
      familyName: userData?.attributes?.family_name || '',
      education: userData?.attributes?.education || [],
      employment: userData?.attributes?.employment || [],
      deactivated: false,
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
