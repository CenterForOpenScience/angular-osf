import { ContributorModel } from '../contributors/contributor.model';

export interface MyResourcesItem {
  id: string;
  dateCreated: string;
  dateModified: string;
  isPublic: boolean;
  contributors: ContributorModel[];
  title: string;
  type: string;
}
