import { ContributorModel } from '../contributors';

export interface Duplicate {
  id: string;
  type: string;
  title: string;
  description: string;
  dateCreated: string;
  dateModified: string;
  public: boolean;
  currentUserPermissions: string[];
  contributors: ContributorModel[];
}

export interface DuplicatesWithTotal {
  data: Duplicate[];
  totalCount: number;
}
