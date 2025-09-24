import { ContributorDataJsonApi, MetaJsonApi, RegistrationNodeAttributesJsonApi } from '@osf/shared/models';

export interface LinkedRegistrationJsonApi {
  id: string;
  type: 'registrations';
  attributes: RegistrationNodeAttributesJsonApi;
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
    };
  };
}

export interface LinkedRegistrationsJsonApiResponse {
  data: LinkedRegistrationJsonApi[];
  meta: MetaJsonApi;
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
