import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';

export function shouldShowItem(id: string | undefined, activeFlags: string[]): boolean {
  if (id === `${FileMenuType.Share}-twitter` || id === `${FileMenuType.Share}-facebook`) {
    return !activeFlags.includes('disable_share_social_media');
  }
  return true;
}
