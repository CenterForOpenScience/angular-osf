import { ResourceType } from '@osf/shared/enums';

import { ModeratorAddModel, ModeratorModel } from '../../models';

const ACTION_SCOPE = '[Moderators]';

export class LoadModerators {
  static readonly type = `${ACTION_SCOPE} Load Moderators`;

  constructor(
    public resourceId: string,
    public resourceType: ResourceType | undefined
  ) {}
}

export class AddModerator {
  static readonly type = `${ACTION_SCOPE} Add Moderator`;

  constructor(
    public resourceId: string,
    public resourceType: ResourceType | undefined,
    public moderator: ModeratorAddModel
  ) {}
}

export class UpdateModerator {
  static readonly type = `${ACTION_SCOPE} Update Moderator`;

  constructor(
    public resourceId: string,
    public resourceType: ResourceType | undefined,
    public moderator: ModeratorModel
  ) {}
}

export class DeleteModerator {
  static readonly type = `${ACTION_SCOPE} Delete Moderator`;

  constructor(
    public resourceId: string,
    public resourceType: ResourceType | undefined,
    public moderatorId: string
  ) {}
}

export class UpdateSearchValue {
  static readonly type = `${ACTION_SCOPE} Update Search Value`;

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
