export interface RouteContext {
  resourceId: string | undefined;
  providerId?: string;
  isProject: boolean;
  isRegistry: boolean;
  isPreprint: boolean;
  preprintReviewsPageVisible?: boolean;
  isCollections: boolean;
  currentUrl?: string;
  isViewOnly?: boolean;
}
