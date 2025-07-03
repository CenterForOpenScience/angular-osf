export class FetchUserInstitutions {
  static readonly type = '[Institutions] Fetch User Institutions';
}

export class FetchInstitutions {
  static readonly type = '[Institutions] Fetch Institutions';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public searchValue?: string
  ) {}
}
