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
