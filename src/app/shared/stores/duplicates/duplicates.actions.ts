export class GetAllDuplicates {
  static readonly type = '[Forks] Get All Duplicates';

  constructor(
    public resourceId: string,
    public resourceType: string,
    public page: number,
    public pageSize: number
  ) {}
}

export class ClearDuplicates {
  static readonly type = '[Forks] Clear Duplicates';
}
