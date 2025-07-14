import { ResourceType } from '@shared/enums';

export class GetBookmarksCollectionId {
  static readonly type = '[Bookmarks] Get Bookmarks Collection Id';
}

export class AddResourceToBookmarks {
  static readonly type = '[Bookmarks] Add Resource To Bookmarks';

  constructor(
    public bookmarksId: string,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class RemoveResourceFromBookmarks {
  static readonly type = '[Bookmarks] Remove Resource From Bookmarks';

  constructor(
    public bookmarksId: string,
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}
