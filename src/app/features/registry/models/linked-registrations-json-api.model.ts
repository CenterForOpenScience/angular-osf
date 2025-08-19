import { MetaJsonApi } from '@osf/shared/models';
import { RegistrationReviewStates } from '@shared/enums';

export interface LinkedRegistrationJsonApi {
  id: string;
  type: 'registrations';
  attributes: {
    title: string;
    description: string;
    category: string;
    date_created: string;
    date_registered?: string;
    date_modified: string;
    reviews_state: RegistrationReviewStates;
    tags: string[];
    public: boolean;
    registration_supplement: string;
    current_user_permissions: string[];
    has_data: boolean;
    has_analytic_code: boolean;
    has_materials: boolean;
    has_papers: boolean;
    has_supplements: boolean;
    withdrawn: boolean;
    embargoed: boolean;
    pending_withdrawal: boolean;
    pending_registration_approval: boolean;
    subjects: {
      id: string;
      text: string;
    }[][];
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
