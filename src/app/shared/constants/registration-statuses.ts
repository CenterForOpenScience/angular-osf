import { RegistryStatus } from '../enums';
import { StatusInfo } from '../models';

export const RegistryStatusMap: Record<RegistryStatus, StatusInfo> = {
  [RegistryStatus.None]: { label: '', severity: null },
  [RegistryStatus.PendingRegistrationApproval]: {
    label: 'shared.statuses.pendingRegistrationApproval',
    severity: 'warn',
  },
  [RegistryStatus.PendingEmbargoApproval]: { label: 'shared.statuses.pendingEmbargoApproval', severity: 'warn' },
  [RegistryStatus.Pending]: { label: 'shared.statuses.pending', severity: 'info' },
  [RegistryStatus.Accepted]: { label: 'shared.statuses.accepted', severity: 'success' },
  [RegistryStatus.Embargo]: { label: 'shared.statuses.embargo', severity: 'info' },
  [RegistryStatus.PendingEmbargoTerminationApproval]: {
    label: 'shared.statuses.pendingEmbargoTerminationApproval',
    severity: 'warn',
  },
  [RegistryStatus.PendingWithdrawRequest]: { label: 'shared.statuses.pendingWithdrawRequest', severity: 'info' },
  [RegistryStatus.PendingWithdraw]: { label: 'shared.statuses.pendingWithdraw', severity: 'warn' },
  [RegistryStatus.Unapproved]: { label: 'shared.statuses.unapproved', severity: 'danger' },
  [RegistryStatus.InProgress]: { label: 'shared.statuses.inProgress', severity: 'info' },
  [RegistryStatus.PendingModeration]: { label: 'shared.statuses.pendingModeration', severity: 'warn' },
  [RegistryStatus.Withdrawn]: { label: 'shared.statuses.withdrawn', severity: 'danger' },
  [RegistryStatus.UpdatePendingApproval]: { label: 'shared.statuses.updatePendingApproval', severity: 'warn' },
};
