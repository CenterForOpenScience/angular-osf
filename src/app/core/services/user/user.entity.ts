export interface User {
  id: string;
  fullName: string;
  givenName: string;
  familyName: string;
  email?: string;
  dateRegistered: Date;
  link?: string;
  iri?: string;
  socials?: {
    orcid?: string;
    github?: string;
    scholar?: string;
    twitter?: string;
    linkedIn?: string;
    impactStory?: string;
    researcherId?: string;
  };
  employment?: {
    title: string;
    department: string;
    institution: string;
    startDate: Date;
    endDate: Date;
    ongoing: boolean;
  }[];
  education?: {
    degree: string;
    department: string;
    institution: string;
    startDate: Date;
    endDate: Date;
    ongoing: boolean;
  }[];
}
