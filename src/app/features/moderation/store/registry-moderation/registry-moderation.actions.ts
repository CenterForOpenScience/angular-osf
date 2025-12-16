import { RegistrySort } from '../../enums';

const ACTION_SCOPE = '[Registry Moderation]';

export class GetRegistrySubmissions {
  static readonly type = `${ACTION_SCOPE} Get Registry Submissions`;

  constructor(
    public provider: string,
    public status: string,
    public page?: number,
    public sort?: RegistrySort
  ) {}
}

export class GetRegistrySubmissionContributors {
  static readonly type = `${ACTION_SCOPE} Get Registry Submission Contributors`;

  constructor(
    public registryId: string,
    public page = 1
  ) {}
}

export class LoadMoreRegistrySubmissionContributors {
  static readonly type = `${ACTION_SCOPE} Load More Registry Submission Contributors`;

  constructor(public registryId: string) {}
}
