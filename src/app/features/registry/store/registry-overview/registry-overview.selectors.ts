import { Selector } from '@ngxs/store';

import { ReviewAction } from '@osf/features/moderation/models';
import { RegistryOverview } from '@osf/features/registry/models';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { Institution } from '@shared/models/institutions/institutions.models';
import { PageSchema } from '@shared/models/registration/page-schema.model';

import { RegistryOverviewStateModel } from './registry-overview.model';
import { RegistryOverviewState } from './registry-overview.state';

export class RegistryOverviewSelectors {
  @Selector([RegistryOverviewState])
  static getRegistry(state: RegistryOverviewStateModel): RegistryOverview | null {
    return state.registry.data;
  }

  @Selector([RegistryOverviewState])
  static isRegistryLoading(state: RegistryOverviewStateModel): boolean {
    return state.registry.isLoading;
  }

  @Selector([RegistryOverviewState])
  static isRegistryAnonymous(state: RegistryOverviewStateModel): boolean {
    return state.isAnonymous;
  }

  @Selector([RegistryOverviewState])
  static getInstitutions(state: RegistryOverviewStateModel): Institution[] | null {
    return state.institutions.data;
  }

  @Selector([RegistryOverviewState])
  static isInstitutionsLoading(state: RegistryOverviewStateModel): boolean {
    return state.institutions.isLoading;
  }

  @Selector([RegistryOverviewState])
  static getSchemaBlocks(state: RegistryOverviewStateModel): PageSchema[] | null {
    return state.schemaBlocks.data;
  }

  @Selector([RegistryOverviewState])
  static isSchemaBlocksLoading(state: RegistryOverviewStateModel): boolean {
    return state.schemaBlocks.isLoading;
  }

  @Selector([RegistryOverviewState])
  static getReviewActions(state: RegistryOverviewStateModel): ReviewAction[] {
    return state.moderationActions.data;
  }

  @Selector([RegistryOverviewState])
  static areReviewActionsLoading(state: RegistryOverviewStateModel): boolean {
    return state.moderationActions.isLoading;
  }

  @Selector([RegistryOverviewState])
  static isReviewActionSubmitting(state: RegistryOverviewStateModel): boolean {
    return state.moderationActions.isSubmitting || false;
  }

  @Selector([RegistryOverviewState])
  static hasReadAccess(state: RegistryOverviewStateModel): boolean {
    return state.registry.data?.currentUserPermissions.includes(UserPermissions.Read) || false;
  }

  @Selector([RegistryOverviewState])
  static hasWriteAccess(state: RegistryOverviewStateModel): boolean {
    return state.registry.data?.currentUserPermissions.includes(UserPermissions.Write) || false;
  }

  @Selector([RegistryOverviewState])
  static hasAdminAccess(state: RegistryOverviewStateModel): boolean {
    return state.registry.data?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  }

  @Selector([RegistryOverviewState])
  static hasNoPermissions(state: RegistryOverviewStateModel): boolean {
    return !state.registry.data?.currentUserPermissions.length;
  }
}
