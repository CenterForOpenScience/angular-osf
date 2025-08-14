export interface Duplicate {
  id: string;
  type: string;
  title: string;
  description: string;
  dateCreated: string;
  dateModified: string;
  public: boolean;
  currentUserPermissions: string[];
  contributors: {
    familyName: string;
    fullName: string;
    givenName: string;
    middleName: string;
    id: string;
    type: string;
  }[];
}

export interface DuplicatesWithTotal {
  data: Duplicate[];
  totalCount: number;
}
