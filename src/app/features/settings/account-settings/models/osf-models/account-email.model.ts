export interface AccountEmail {
  id: string;
  emailAddress: string;
  confirmed: boolean;
  verified: boolean;
  primary: boolean;
  isMerge: boolean;
}
