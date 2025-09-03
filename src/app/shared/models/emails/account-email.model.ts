export interface AccountEmailModel {
  id: string;
  emailAddress: string;
  confirmed: boolean;
  verified: boolean;
  primary: boolean;
  isMerge: boolean;
}
