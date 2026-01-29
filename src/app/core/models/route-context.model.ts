import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

export interface RouteContext {
  resourceId: string | undefined;
  providerId?: string;
  wikiPageVisible?: boolean;
  isProject: boolean;
  isRegistry: boolean;
  isPreprint: boolean;
  isCollections: boolean;
  preprintReviewsPageVisible?: boolean;
  registrationModerationPageVisible?: boolean;
  collectionModerationPageVisible?: boolean;
  currentUrl?: string;
  viewOnly?: string | null;
  permissions?: UserPermissions[];
}
