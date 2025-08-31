export class FetchInstitutionById {
  static readonly type = '[InstitutionsSearch] Fetch Institution By Id';

  constructor(public institutionId: string) {}
}
