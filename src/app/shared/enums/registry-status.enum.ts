export enum RegistryStatus {
  None = 'None',
  PendingRegistrationApproval = 'pendingRegistrationApproval',
  PendingEmbargoApproval = 'pendingEmbargoApproval',
  Pending = 'pending',
  Accepted = 'accepted',
  Embargo = 'embargo',
  PendingEmbargoTerminationApproval = 'pendingEmbargoTermination',
  PendingWithdrawRequest = 'pendingWithdrawRequest',
  PendingWithdraw = 'pendingWithdraw',
  Unapproved = 'unapproved',
  InProgress = 'inProgress',
  PendingModeration = 'pendingModeration',
}
