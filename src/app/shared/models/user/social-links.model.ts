import { SocialModel } from './social.model';

export type SocialLinksKeys = keyof SocialModel;

export const SOCIAL_KEYS: SocialLinksKeys[] = ['github', 'twitter', 'linkedIn', 'profileWebsites'];

export interface SocialLinksModel {
  id: number;
  label: string;
  address: string;
  placeholder: string;
  key: SocialLinksKeys;
  icon: string;
  linkedField?: {
    key: SocialLinksKeys;
    label: string;
    placeholder: string;
    address: string;
  };
}

export interface SocialLinksForm {
  socialOutput: SocialLinksModel;
  webAddress: string;
  linkedWebAddress?: string;
}
