export interface UserUS {
  id: string;
  type: string;
  attributes: {
    full_name: string;
    given_name: string;
    family_name: string;
    email: string;
    date_registered: string;
    social: {
      orcid: string;
      github: string;
      scholar: string;
      twitter: string;
      linkedIn: string;
      impactStory: string;
      researcherId: string;
    };
    employment: {
      title: string;
      endYear: number;
      ongoing: boolean;
      endMonth: number;
      startYear: number;
      department: string;
      startMonth: number;
      institution: string;
    }[];
    education: {
      degree: string;
      department: string;
      institution: string;
      startYear: number;
      startMonth: number;
      endYear: number;
      endMonth: number;
      ongoing: boolean;
    }[];
  };
  relationships: Record<string, unknown>;
  links: {
    html: string;
    profile_image: string;
    iri: string;
  };
}
