export interface AccountSettings {
  twoFactorEnabled: boolean;
  twoFactorConfirmed: boolean;
  subscribeOsfGeneralEmail: boolean;
  subscribeOsfHelpEmail: boolean;
  deactivationRequested: boolean;
  contactedDeactivation: boolean;
  secret: string;
}
