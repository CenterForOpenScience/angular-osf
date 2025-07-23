export class GetCollectionSubmissions {
  static readonly type = '[Collections Moderation] Get Collection Submissions';

  constructor(
    public collectionId: string,
    public status: string,
    public page: string,
    public sortBy: string
  ) {}
}
