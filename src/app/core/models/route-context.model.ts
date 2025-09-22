export interface RouteContext {
  resourceId: string | undefined;
  providerId?: string;
  isProject: boolean;
  isRegistry: boolean;
  isPreprint: boolean;
  preprintReviewsPageVisible?: boolean;
  registrationModerationPageVisible?: boolean;
  collectionModerationPageVisible?: boolean;
  isCollections: boolean;
  currentUrl?: string;
  isViewOnly?: boolean;
}
