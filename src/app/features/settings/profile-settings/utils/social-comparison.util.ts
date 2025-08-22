import { Social } from '@osf/shared/models';

import { SOCIAL_KEYS, SocialLinksForm, SocialLinksKeys, SocialLinksModel } from '../models';

export function normalizeValue(value: unknown, key: SocialLinksKeys): unknown {
  if (SOCIAL_KEYS.includes(key)) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }
  return value;
}

export function mapSocialLinkToPayload(link: SocialLinksForm): Partial<Social> {
  const key = link.socialOutput.key as SocialLinksKeys;
  const linkedKey = link.socialOutput.linkedField?.key as SocialLinksKeys;

  const value = SOCIAL_KEYS.includes(key)
    ? Array.isArray(link.webAddress)
      ? link.webAddress
      : [link.webAddress].filter(Boolean)
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
  socials: SocialLinksModel[]
): boolean {
  const social = socials[socialIndex];
  if (!social) return true;

  const mappedLink = mapSocialLinkToPayload(link);
  const { key, linkedField } = social;

  const hasChanged = (currentKey: keyof Social) => {
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

// export function hasSocialLinkChanges(
//   link: SocialLinksForm,
//   initialSocialLinks: Social,
//   socialIndex: number,
//   socials: SocialLinksModel[]
// ): boolean {
//   const mappedLink = mapSocialLinkToPayload(link);
//   const social = socials[socialIndex];

//   if (!social) return true;

//   const key = social.key;
//   const linkedKey = social.linkedField?.key;

//   const currentValue = mappedLink[key];
//   const initialValue = normalizeValue(initialSocialLinks[key], key);

//   if (linkedKey) {
//     const currentLinkedValue = mappedLink[linkedKey];
//     const initialLinkedValue = normalizeValue(initialSocialLinks[linkedKey], linkedKey);

//     if (!currentValue && !initialValue && !currentLinkedValue && !initialLinkedValue) return false;

//     if (
//       JSON.stringify(currentLinkedValue) !== JSON.stringify(initialLinkedValue) ||
//       JSON.stringify(currentValue) !== JSON.stringify(initialValue)
//     ) {
//       return true;
//     }
//   } else {
//     if (!currentValue && !initialValue) return false;

//     if (JSON.stringify(currentValue) !== JSON.stringify(initialValue)) {
//       return true;
//     }
//   }

//   return false;
// }
