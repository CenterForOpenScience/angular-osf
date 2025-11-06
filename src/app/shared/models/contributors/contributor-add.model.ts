export interface ContributorAddModel {
  id?: string;
  isBibliographic: boolean;
  permission: string;
  fullName?: string;
  email?: string;
  index?: number;
  checked?: boolean;
  disabled?: boolean;
}
