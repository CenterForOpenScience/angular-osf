import { SocialModel } from '@osf/shared/models/user/social.model';
import { SocialLinkViewModel } from '@osf/shared/models/user/social-link-view.model';
import { SocialLinksModel } from '@osf/shared/models/user/social-links.model';

export function mapUserSocials(
  socialData: SocialModel | undefined,
  socialLinks: SocialLinksModel[]
): SocialLinkViewModel[] {
  if (!socialData) {
    return [];
  }

  return socialLinks.reduce<SocialLinkViewModel[]>((acc, social) => {
    const socialValue = socialData[social.key];

    if (!socialValue || (Array.isArray(socialValue) && socialValue.length === 0)) {
      return acc;
    }

    let url;
    if (social.linkedField) {
      const linkedValue = socialData[social.linkedField.key];
      if (linkedValue) {
        url = `${social.address}${socialValue}${social.linkedField.address}${linkedValue}`;
      }
    } else {
      const value = Array.isArray(socialValue) ? socialValue[0] : socialValue;
      url = social.address + value;
    }

    if (url) {
      acc.push({
        url,
        icon: `assets/icons/socials/${social.icon}`,
        alt: social.label,
      });
    }

    return acc;
  }, []);
}
