export interface ComponentOverview {
  id: string;
  type: string;
  title: string;
  description: string;
  public: boolean;
  contributors: {
    familyName: string;
    fullName: string;
    givenName: string;
    middleName: string;
    id: string;
    type: string;
  }[];
}

export interface ComponentGetResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    public: boolean;
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
