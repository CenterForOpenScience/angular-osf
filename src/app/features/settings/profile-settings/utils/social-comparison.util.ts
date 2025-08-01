import { Social } from '@osf/shared/models';

import { SOCIAL_KEYS, SocialLinksForm, SocialLinksKeys } from '../models';

export function normalizeValue(value: unknown, key: SocialLinksKeys): unknown {
  if (SOCIAL_KEYS.includes(key)) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }
  return value;
}

export function mapSocialLinkToPayload(link: SocialLinksForm): Partial<Social> {
  const key = link.socialOutput.key as SocialLinksKeys;
  const linkedKey = link.socialOutput.linkedField?.key as SocialLinksKeys | undefined;

  const value = SOCIAL_KEYS.includes(key)
    ? Array.isArray(link.webAddress)
      ? link.webAddress
      : [link.webAddress]
    : link.webAddress;

  const result: Partial<Social> = { [key]: value };

  if (linkedKey) {
    const typeSafeResult = result as Record<SocialLinksKeys, unknown>;
    typeSafeResult[linkedKey] = SOCIAL_KEYS.includes(linkedKey) ? [link.linkedWebAddress] : link.linkedWebAddress;
  }

  return result;
}

export function hasSocialLinkChanges(
  link: SocialLinksForm,
  initialSocialLinks: Social,
  socialIndex: number,
  socials: readonly { key: string; linkedField?: { key: string } }[]
): boolean {
  const mappedLink = mapSocialLinkToPayload(link);
  const social = socials[socialIndex];

  if (!social) return true;

  const key = social.key as SocialLinksKeys;
  const linkedKey = social.linkedField?.key as SocialLinksKeys | undefined;

  const currentValue = mappedLink[key];
  const initialValue = normalizeValue(initialSocialLinks[key], key);

  if (JSON.stringify(currentValue) !== JSON.stringify(initialValue)) {
    return true;
  }

  if (linkedKey) {
    const currentLinkedValue = mappedLink[linkedKey];
    const initialLinkedValue = normalizeValue(initialSocialLinks[linkedKey], linkedKey);

    if (JSON.stringify(currentLinkedValue) !== JSON.stringify(initialLinkedValue)) {
      return true;
    }
  }

  return false;
}
