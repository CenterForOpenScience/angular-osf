import { RegistrationModel, RegistrationsGetResponse, RegistrationStatus } from '../models';

export class RegistrationsMapper {
  static fromResponse(response: RegistrationsGetResponse): RegistrationModel {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes?.title,
      dateRegistered: response.attributes?.date_registered,
      dateModified: response.attributes?.date_modified,
      registrationSupplement: response.attributes?.registration_supplement,
      registry: '',
      description: response.attributes?.description,
      withdrawn: response.attributes?.withdrawn,
      lastFetched: Date.now(),
      status: response.attributes?.withdrawn
        ? RegistrationStatus.WITHDRAWN
        : response.attributes?.date_modified
          ? RegistrationStatus.IN_PROGRESS
          : RegistrationStatus.DRAFT,
    };
  }
}
