import { RegistryOverviewJsonApiAttributes } from '@osf/features/registry/models';
import { RegistrationAttributesJsonApi } from '@osf/shared/models';
import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@shared/enums';

export function MapRegistryStatus(
  registry: RegistryOverviewJsonApiAttributes | RegistrationAttributesJsonApi
): RegistryStatus {
  if (registry.pending_embargo_approval) {
    return RegistryStatus.PendingEmbargoApproval;
  } else if (registry.pending_embargo_termination_approval) {
    return RegistryStatus.PendingEmbargoTerminationApproval;
  } else if (registry.embargoed) {
    return RegistryStatus.Embargo;
  } else if (registry.pending_registration_approval) {
    return RegistryStatus.PendingRegistrationApproval;
  } else if (
    registry.revision_state === RevisionReviewStates.Unapproved &&
    registry.reviews_state === RegistrationReviewStates.Accepted
  ) {
    return RegistryStatus.UpdatePendingApproval;
  } else if (registry.revision_state === RevisionReviewStates.Unapproved) {
    return RegistryStatus.Unapproved;
  } else if (registry.revision_state === RevisionReviewStates.RevisionInProgress) {
    return RegistryStatus.InProgress;
  } else if (registry.revision_state === RevisionReviewStates.RevisionPendingModeration) {
    return RegistryStatus.PendingModeration;
  } else if (registry.reviews_state === RegistrationReviewStates.Accepted) {
    return RegistryStatus.Accepted;
  } else if (registry.reviews_state === RegistrationReviewStates.Pending) {
    return RegistryStatus.Pending;
  } else if (registry.reviews_state === RegistrationReviewStates.PendingWithdraw) {
    return RegistryStatus.PendingWithdraw;
  } else if (registry.reviews_state === RegistrationReviewStates.PendingWithdrawRequest) {
    return RegistryStatus.PendingWithdrawRequest;
  } else if (registry.reviews_state === RegistrationReviewStates.Withdrawn) {
    return RegistryStatus.Withdrawn;
  } else {
    return RegistryStatus.None;
  }
}
