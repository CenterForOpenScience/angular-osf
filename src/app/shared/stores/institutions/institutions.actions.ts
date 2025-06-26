export class GetUserInstitutions {
  static readonly type = '[Institutions] Get User Institutions';
}

export class FetchInstitutions {
  static readonly type = '[Institutions] Get';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public searchValue?: string
  ) {}
}
