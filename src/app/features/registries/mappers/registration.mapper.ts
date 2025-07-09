import { RegistrationDataJsonApi } from '../models';
import { Registration } from '../models/registration.model';

export class RegistrationMapper {
  static fromRegistrationResponse(response: RegistrationDataJsonApi): Registration {
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
    };
  }
}
