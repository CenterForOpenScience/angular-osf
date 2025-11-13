import { SocialModel } from '@osf/shared/models/user/social.model';
import {
  SOCIAL_KEYS,
  SocialLinksForm,
  SocialLinksKeys,
  SocialLinksModel,
} from '@osf/shared/models/user/social-links.model';

export function normalizeValue(value: unknown, key: SocialLinksKeys): unknown {
  if (SOCIAL_KEYS.includes(key)) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }
  return value;
}

export function mapSocialLinkToPayload(link: SocialLinksForm): Partial<SocialModel> {
  const key = link.socialOutput.key as SocialLinksKeys;
  const linkedKey = link.socialOutput.linkedField?.key as SocialLinksKeys;

  const value = SOCIAL_KEYS.includes(key)
    ? Array.isArray(link.webAddress)
      ? link.webAddress
      : [link.webAddress].filter(Boolean)
    : link.webAddress;

  const result: Partial<SocialModel> = { [key]: value };

  if (linkedKey) {
    const typeSafeResult = result as Record<SocialLinksKeys, unknown>;
    typeSafeResult[linkedKey] = SOCIAL_KEYS.includes(linkedKey) ? [link.linkedWebAddress] : link.linkedWebAddress;
  }

  return result;
}

export function hasSocialLinkChanges(
  link: SocialLinksForm,
  initialSocialLinks: SocialModel,
  socialIndex: number,
  socials: SocialLinksModel[]
): boolean {
  const social = socials[socialIndex];
  if (!social) return true;

  const mappedLink = mapSocialLinkToPayload(link);
  const { key, linkedField } = social;

  const hasChanged = (currentKey: keyof SocialModel) => {
    const current = mappedLink[currentKey];
    const initial = normalizeValue(initialSocialLinks[currentKey], currentKey);

    if (!current && !initial) {
      return false;
    }

    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  if (hasChanged(key)) {
    return true;
  }

  if (linkedField?.key && hasChanged(linkedField.key)) {
    return true;
  }

  return false;
}
