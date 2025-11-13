import { Selector } from '@ngxs/store';

import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources.models';

import { MyResourcesStateModel } from './my-resources.model';
import { MyResourcesState } from './my-resources.state';

export class MyResourcesSelectors {
  @Selector([MyResourcesState])
  static getProjects(state: MyResourcesStateModel): MyResourcesItem[] {
    return state.projects.data;
  }

  @Selector([MyResourcesState])
  static getProjectsLoading(state: MyResourcesStateModel): boolean {
    return state.projects.isLoading;
  }

  @Selector([MyResourcesState])
  static isProjectSubmitting(state: MyResourcesStateModel): boolean {
    return state.projects.isSubmitting || false;
  }

  @Selector([MyResourcesState])
  static getRegistrations(state: MyResourcesStateModel): MyResourcesItem[] {
    return state.registrations.data;
  }

  @Selector([MyResourcesState])
  static getRegistrationsLoading(state: MyResourcesStateModel): boolean {
    return state.registrations.isLoading;
  }

  @Selector([MyResourcesState])
  static getPreprints(state: MyResourcesStateModel): MyResourcesItem[] {
    return state.preprints.data;
  }

  @Selector([MyResourcesState])
  static getTotalProjects(state: MyResourcesStateModel): number {
    return state.projects.totalCount;
  }

  @Selector([MyResourcesState])
  static getTotalRegistrations(state: MyResourcesStateModel): number {
    return state.registrations.totalCount;
  }

  @Selector([MyResourcesState])
  static getTotalPreprints(state: MyResourcesStateModel): number {
    return state.preprints.totalCount;
  }
}
