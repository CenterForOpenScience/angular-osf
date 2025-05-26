export interface Social {
  ssrn: string;
  orcid: string;
  github: string[];
  scholar: string;
  twitter: string[];
  linkedIn: string[];
  impactStory: string;
  baiduScholar: string;
  researchGate: string;
  researcherId: string;
  profileWebsites: string[];
  academiaProfileID: string;
  academiaInstitution: string;
}

export type SocialLinksKeys = keyof Social;

export const SOCIAL_KEYS: SocialLinksKeys[] = ['github', 'twitter', 'linkedIn', 'profileWebsites'];

export interface SocialLinksModel {
  id: number;
  label: string;
  address: string;
  placeholder: string;
  key: SocialLinksKeys;
}

export interface SocialLinksForm {
  socialOutput: SocialLinksModel;
  webAddress: string;
}
