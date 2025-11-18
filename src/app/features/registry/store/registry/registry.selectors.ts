import { Selector } from '@ngxs/store';

import { ReviewAction } from '@osf/features/moderation/models';
import { RegistrationOverviewModel } from '@osf/features/registry/models';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { Institution } from '@shared/models/institutions/institutions.models';
import { PageSchema } from '@shared/models/registration/page-schema.model';

import { RegistryStateModel } from './registry.model';
import { RegistryState } from './registry.state';

export class RegistrySelectors {
  @Selector([RegistryState])
  static getRegistry(state: RegistryStateModel): RegistrationOverviewModel | null {
    return state.registry.data;
  }

  @Selector([RegistryState])
  static isRegistryLoading(state: RegistryStateModel): boolean {
    return state.registry.isLoading;
  }

  @Selector([RegistryState])
  static isRegistryAnonymous(state: RegistryStateModel): boolean {
    return state.isAnonymous;
  }

  @Selector([RegistryState])
  static getInstitutions(state: RegistryStateModel): Institution[] | null {
    return state.institutions.data;
  }

  @Selector([RegistryState])
  static isInstitutionsLoading(state: RegistryStateModel): boolean {
    return state.institutions.isLoading;
  }

  @Selector([RegistryState])
  static getSchemaBlocks(state: RegistryStateModel): PageSchema[] | null {
    return state.schemaBlocks.data;
  }

  @Selector([RegistryState])
  static isSchemaBlocksLoading(state: RegistryStateModel): boolean {
    return state.schemaBlocks.isLoading;
  }

  @Selector([RegistryState])
  static getReviewActions(state: RegistryStateModel): ReviewAction[] {
    return state.moderationActions.data;
  }

  @Selector([RegistryState])
  static areReviewActionsLoading(state: RegistryStateModel): boolean {
    return state.moderationActions.isLoading;
  }

  @Selector([RegistryState])
  static isReviewActionSubmitting(state: RegistryStateModel): boolean {
    return state.moderationActions.isSubmitting || false;
  }

  @Selector([RegistryState])
  static getIdentifiers(state: RegistryStateModel): IdentifierModel[] {
    return state.identifiers.data;
  }

  @Selector([RegistryState])
  static isIdentifiersLoading(state: RegistryStateModel): boolean {
    return state.identifiers.isLoading;
  }

  @Selector([RegistryState])
  static getLicense(state: RegistryStateModel): LicenseModel | null {
    return state.license.data;
  }

  @Selector([RegistryState])
  static isLicenseLoading(state: RegistryStateModel): boolean {
    return state.license.isLoading;
  }

  @Selector([RegistryState])
  static getSchemaResponses(state: RegistryStateModel): SchemaResponse[] {
    return state.schemaResponses.data;
  }

  @Selector([RegistryState])
  static isSchemaResponsesLoading(state: RegistryStateModel): boolean {
    return state.schemaResponses.isLoading;
  }

  @Selector([RegistryState])
  static hasWriteAccess(state: RegistryStateModel): boolean {
    return state.registry.data?.currentUserPermissions.includes(UserPermissions.Write) || false;
  }

  @Selector([RegistryState])
  static hasAdminAccess(state: RegistryStateModel): boolean {
    return state.registry.data?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  }

  @Selector([RegistryState])
  static getSchemaResponse(state: RegistryStateModel): SchemaResponse | null {
    return state.currentSchemaResponse.data;
  }

  @Selector([RegistryState])
  static getSchemaResponseLoading(state: RegistryStateModel): boolean {
    return state.currentSchemaResponse.isLoading || !!state.currentSchemaResponse.isSubmitting;
  }
}
