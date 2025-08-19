export interface RouteContext {
  resourceId: string | undefined;
  providerId?: string;
  isProject: boolean;
  isRegistry: boolean;
  isPreprint: boolean;
  isCollections: boolean;
  currentUrl?: string;
}
