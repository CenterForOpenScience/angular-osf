import { Education } from '@osf/features/settings/profile-settings/education/educations.entities';
import { Employment } from '@osf/features/settings/profile-settings/employment/employment.entities';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

export interface User {
  id: string;
  fullName: string;
  givenName: string;
  familyName: string;
  email?: string;
  middleNames?: string;
  suffix?: string;
  education: Education[];
  employment: Employment[];
  social: Social;
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
}
