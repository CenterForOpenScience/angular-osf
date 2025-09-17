import { ContributorResponse, MetaJsonApi, RegistrationNodeAttributesJsonApi } from '@osf/shared/models';

export interface LinkedRegistrationJsonApi {
  id: string;
  type: 'registrations';
  attributes: RegistrationNodeAttributesJsonApi;
  embeds: {
    bibliographic_contributors: {
      data: ContributorResponse[];
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
