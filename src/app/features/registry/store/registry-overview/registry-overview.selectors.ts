import { Selector } from '@ngxs/store';

import { RegistryInstitution, RegistryOverview, RegistrySchemaBlock, RegistrySubject } from '../../models';

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
  static getSubjects(state: RegistryOverviewStateModel): RegistrySubject[] | null {
    return state.subjects.data;
  }

  @Selector([RegistryOverviewState])
  static isSubjectsLoading(state: RegistryOverviewStateModel): boolean {
    return state.subjects.isLoading;
  }

  @Selector([RegistryOverviewState])
  static getInstitutions(state: RegistryOverviewStateModel): RegistryInstitution[] | null {
    return state.institutions.data;
  }

  @Selector([RegistryOverviewState])
  static isInstitutionsLoading(state: RegistryOverviewStateModel): boolean {
    return state.institutions.isLoading;
  }

  @Selector([RegistryOverviewState])
  static getSchemaBlocks(state: RegistryOverviewStateModel): RegistrySchemaBlock[] | null {
    return state.schemaBlocks.data;
  }

  @Selector([RegistryOverviewState])
  static isSchemaBlocksLoading(state: RegistryOverviewStateModel): boolean {
    return state.schemaBlocks.isLoading;
  }
}
