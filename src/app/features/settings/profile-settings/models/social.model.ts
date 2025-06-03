import { Social } from '@osf/shared/models';

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
