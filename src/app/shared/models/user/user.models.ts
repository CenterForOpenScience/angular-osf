import { Education } from './education.model';
import { Employment } from './employment.model';
import { ExternalIdentityModel } from './external-identity.model';
import { SocialModel } from './social.model';

export interface UserData {
  activeFlags: string[];
  currentUser: UserModel | null;
}

export interface UserModel {
  id: string;
  acceptedTermsOfService: boolean;
  active: boolean;
  allowIndexing: boolean;
  canViewReviews: boolean;
  dateRegistered: string;
  education: Education[];
  employment: Employment[];
  familyName: string;
  fullName: string;
  givenName: string;
  middleNames: string;
  suffix: string;
  timezone: string;
  locale: string;
  social: SocialModel;
  external_identity: ExternalIdentityModel;
  defaultRegionId: string;
  link?: string;
  iri?: string;
  mergedBy?: string;
}
