import { ContributorDataJsonApi } from '../contributors';

export interface DuplicateJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    forked_date: string;
    date_modified: string;
    description: string;
    public: boolean;
    current_user_permissions: string[];
  };
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
    };
  };
}
