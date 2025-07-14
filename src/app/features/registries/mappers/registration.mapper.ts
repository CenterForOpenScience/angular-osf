import { DraftRegistrationModel, RegistrationModel } from '@osf/shared/models/registration';

import { RegistrationDataJsonApi } from '../models';

export class RegistrationMapper {
  static fromDraftRegistrationResponse(response: RegistrationDataJsonApi): DraftRegistrationModel {
    return {
      id: response.id,
      title: response.attributes.title,
      description: response.attributes.description,
      registrationSchemaId: response.relationships.registration_schema?.data?.id || '',
      license: {
        id: response.relationships.license?.data?.id || '',
        options: response.attributes.node_license
          ? {
              year: response.attributes.node_license.year,
              copyrightHolders: response.attributes.node_license.copyright_holders.join(','),
            }
          : null,
      },
      tags: response.attributes.tags || [],
      stepsData: response.attributes.registration_responses || {},
      branchedFrom: response.relationships.branched_from?.data?.id,
      providerId: response.relationships.provider?.data?.id || '',
    };
  }

  static fromRegistrationResponse(response: RegistrationDataJsonApi): RegistrationModel {
    return {
      id: response.id,
      type: 'registration',
    } as RegistrationModel;
  }

  static toRegistrationPayload(draftId: string, embargoDate: string, providerId: string, projectId?: string) {
    return {
      data: {
        type: 'registrations',
        attributes: {
          embargo_end_date: embargoDate,
          draft_registration: draftId,
        },
        relationships: {
          registered_from: projectId
            ? {
                data: {
                  type: 'nodes',
                  id: projectId,
                },
              }
            : undefined,

          provider: {
            data: {
              type: 'registration-providers',
              id: providerId,
            },
          },
        },
      },
    };
  }
}
