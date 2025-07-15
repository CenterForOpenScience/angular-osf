import { RegistryStatus } from '@osf/shared/enums';
import {
  DraftRegistrationDataJsonApi,
  DraftRegistrationModel,
  RegistrationCard,
  RegistrationDataJsonApi,
  RegistrationModel,
} from '@osf/shared/models';

export class RegistrationMapper {
  static fromDraftRegistrationResponse(response: DraftRegistrationDataJsonApi): DraftRegistrationModel {
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
      hasProject: !!response.attributes.has_project,
      components: [],
    };
  }

  static fromRegistrationResponse(response: RegistrationDataJsonApi): RegistrationModel {
    return {
      id: response.id,
      type: 'registration',
    } as RegistrationModel;
  }

  static fromDraftToRegistrationCard(registration: DraftRegistrationDataJsonApi): RegistrationCard {
    return {
      id: registration.id,
      title: registration.attributes.title,
      description: registration.attributes.description || '',
      status: RegistryStatus.None,
      dateCreated: registration.attributes.datetime_initiated,
      dateModified: registration.attributes.datetime_updated,
      registrationTemplate: registration.embeds?.registration_schema?.data?.attributes?.name || '',
      registry: registration.embeds?.provider?.data?.attributes?.name || '',
      contributors:
        registration.embeds?.bibliographic_contributors?.data.map((contributor) => ({
          id: contributor.id,
          fullName: contributor.embeds?.users?.data.attributes.full_name,
        })) || [],
    };
  }

  static fromRegistrationToRegistrationCard(registration: RegistrationDataJsonApi): RegistrationCard {
    return {
      id: registration.id,
      title: registration.attributes.title,
      description: registration.attributes.description || '',
      status: RegistryStatus.InProgress, // [NM] TODO: map status accordingly
      dateCreated: registration.attributes.datetime_initiated,
      dateModified: registration.attributes.date_modified,
      registrationTemplate: registration.embeds?.registration_schema?.data?.attributes?.name || '',
      registry: registration.embeds?.provider?.data?.attributes?.name || '',
      contributors:
        registration.embeds?.bibliographic_contributors?.data.map((contributor) => ({
          id: contributor.id,
          fullName: contributor.embeds?.users?.data.attributes.full_name,
        })) || [],
    };
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
