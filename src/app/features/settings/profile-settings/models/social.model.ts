import { Social } from '@osf/shared/models';

export type SocialLinksKeys = keyof Social;

export const SOCIAL_KEYS: SocialLinksKeys[] = ['github', 'twitter', 'linkedIn', 'profileWebsites'];

export interface SocialLinksModel {
  id: number;
  label: string;
  address: string;
  placeholder: string;
  key: SocialLinksKeys;
  linkedField?: {
    key: SocialLinksKeys;
    label: string;
    placeholder: string;
  };
}

export interface SocialLinksForm {
  socialOutput: SocialLinksModel;
  webAddress: string;
  linkedWebAddress?: string;
}
