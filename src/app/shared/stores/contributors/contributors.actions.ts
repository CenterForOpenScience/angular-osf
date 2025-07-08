import { ResourceType } from '@osf/shared/enums';
import { ContributorAddModel, ContributorModel } from '@osf/shared/models';

export class GetAllContributors {
  static readonly type = '[Contributors] Get All Contributors';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined
  ) {}
}

export class UpdateSearchValue {
  static readonly type = '[Contributors] Update Search Value';

  constructor(public searchValue: string | null) {}
}

export class UpdatePermissionFilter {
  static readonly type = '[Contributors] Update Permission Filter';

  constructor(public permissionFilter: string | null) {}
}

export class UpdateBibliographyFilter {
  static readonly type = '[Contributors] Update Bibliography Filter';

  constructor(public bibliographyFilter: boolean | null) {}
}

export class AddContributor {
  static readonly type = '[Contributors] Add Contributor';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public contributor: ContributorAddModel
  ) {}
}

export class UpdateContributor {
  static readonly type = '[Contributors] Update Contributor';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public contributor: ContributorModel
  ) {}
}

export class DeleteContributor {
  static readonly type = '[Contributors] Delete Contributor';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public contributorId: string
  ) {}
}

export class SearchUsers {
  static readonly type = '[Contributors] Search Users';

  constructor(
    public searchValue: string | null,
    public page: number
  ) {}
}

export class ClearUsers {
  static readonly type = '[Contributors] Clear Users';
}
