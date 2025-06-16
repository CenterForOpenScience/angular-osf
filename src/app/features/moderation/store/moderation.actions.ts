import { ModeratorModel } from '../models';

const ACTION_SCOPE = '[Moderation]';

export class LoadCollectionModerators {
  static readonly type = `${ACTION_SCOPE} Load Collection Moderators`;

  constructor(public collectionId: string) {}
}

export class AddCollectionModerator {
  static readonly type = `${ACTION_SCOPE} Add Collection Moderator`;

  constructor(
    public collectionId: string,
    public moderator: ModeratorModel
  ) {}
}

export class UpdateCollectionModerator {
  static readonly type = `${ACTION_SCOPE} Update Collection Moderator`;

  constructor(
    public collectionId: string,
    public moderator: ModeratorModel
  ) {}
}

export class DeleteCollectionModerator {
  static readonly type = `${ACTION_SCOPE} Delete Collection Moderator`;

  constructor(
    public collectionId: string,
    public moderatorId: string
  ) {}
}

export class UpdateCollectionSearchValue {
  static readonly type = `${ACTION_SCOPE} Update Collection Search Value`;

  constructor(public searchValue: string | null) {}
}

export class SearchUsers {
  static readonly type = `${ACTION_SCOPE} Search Users`;
  constructor(
    public searchValue: string | null,
    public page: number
  ) {}
}

export class ClearUsers {
  static readonly type = `${ACTION_SCOPE} Clear Users`;
}
