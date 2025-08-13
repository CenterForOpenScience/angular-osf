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
      data: {
        embeds: {
          users: {
            data: {
              id: string;
              type: string;
              attributes: {
                family_name: string;
                full_name: string;
                given_name: string;
                middle_name: string;
              };
            };
          };
        };
      }[];
    };
  };
}
