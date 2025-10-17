import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { ContributorAddModel, ContributorModel, RequestAccessPayload } from '@osf/shared/models';

export class GetAllContributors {
  static readonly type = '[Contributors] Get All Contributors';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public page = 1,
    public pageSize = DEFAULT_TABLE_PARAMS.rows
  ) {}
}

export class UpdateContributorsSearchValue {
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

export class BulkUpdateContributors {
  static readonly type = '[Contributors] Bulk Update Contributors';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public contributors: ContributorModel[]
  ) {}
}

export class BulkAddContributors {
  static readonly type = '[Contributors] Bulk Add Contributors';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public contributors: ContributorAddModel[],
    public childNodeIds?: string[]
  ) {}
}

export class BulkAddContributorsFromParentProject {
  static readonly type = '[Contributors] Bulk Add Contributors From Parent Project';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined
  ) {}
}

export class DeleteContributor {
  static readonly type = '[Contributors] Delete Contributor';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public contributorId: string,
    public skipRefresh = false
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

export class ResetContributorsState {
  static readonly type = '[Contributors] Reset State';
}

export class GetRequestAccessContributors {
  static readonly type = '[Contributors] Get Request Access Contributors';

  constructor(
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined
  ) {}
}

export class AcceptRequestAccess {
  static readonly type = '[Contributors] Accept Request Access';

  constructor(
    public requestId: string | undefined | null,
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined,
    public payload: RequestAccessPayload
  ) {}
}

export class RejectRequestAccess {
  static readonly type = '[Contributors] Reject Request Access';

  constructor(
    public requestId: string | undefined | null,
    public resourceId: string | undefined | null,
    public resourceType: ResourceType | undefined
  ) {}
}
