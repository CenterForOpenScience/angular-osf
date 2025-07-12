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
}
