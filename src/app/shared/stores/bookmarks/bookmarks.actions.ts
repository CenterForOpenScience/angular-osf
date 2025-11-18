import { ResourceType } from '@shared/enums/resource-type.enum';
import { MyResourcesSearchFilters } from '@shared/models/my-resources/my-resources-search-filters.models';

export class GetBookmarksCollectionId {
  static readonly type = '[Bookmarks] Get Bookmarks Collection Id';
}

export class GetAllMyBookmarks {
  static readonly type = '[Bookmarks] Get Bookmarks';

  constructor(
    public bookmarkCollectionId: string,
    public filters?: MyResourcesSearchFilters
  ) {}
}

export class GetResourceBookmark {
  static readonly type = '[Bookmarks] Get Resource Bookmark';

  constructor(
    public bookmarkCollectionId: string,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class AddResourceToBookmarks {
  static readonly type = '[Bookmarks] Add Resource To Bookmarks';

  constructor(
    public bookmarkCollectionId: string,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class RemoveResourceFromBookmarks {
  static readonly type = '[Bookmarks] Remove Resource From Bookmarks';

  constructor(
    public bookmarkCollectionId: string,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}
