import { RegistryStatus } from '@osf/shared/enums';
import { StatusInfo } from '@osf/shared/models';

export const RegistryStatusMap: Record<RegistryStatus, StatusInfo> = {
  [RegistryStatus.None]: { label: '', severity: null },
  [RegistryStatus.PendingRegistrationApproval]: { label: 'statuses.pendingRegistrationApproval', severity: 'warn' },
  [RegistryStatus.PendingEmbargoApproval]: { label: 'statuses.pendingEmbargoApproval', severity: 'warn' },
  [RegistryStatus.Pending]: { label: 'statuses.pending', severity: 'info' },
  [RegistryStatus.Accepted]: { label: 'statuses.accepted', severity: 'success' },
  [RegistryStatus.Embargo]: { label: 'statuses.embargo', severity: 'info' },
  [RegistryStatus.PendingEmbargoTerminationApproval]: {
    label: 'statuses.pendingEmbargoTerminationApproval',
    severity: 'warn',
  },
  [RegistryStatus.PendingWithdrawRequest]: { label: 'statuses.pendingWithdrawRequest', severity: 'info' },
  [RegistryStatus.PendingWithdraw]: { label: 'statuses.pendingWithdraw', severity: 'warn' },
  [RegistryStatus.Unapproved]: { label: 'statuses.unapproved', severity: 'danger' },
  [RegistryStatus.InProgress]: { label: 'statuses.inProgress', severity: 'info' },
  [RegistryStatus.PendingModeration]: { label: 'statuses.pendingModeration', severity: 'warn' },
};
