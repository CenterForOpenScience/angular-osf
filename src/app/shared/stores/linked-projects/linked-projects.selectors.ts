import { Selector } from '@ngxs/store';

import { LinkedProjectsStateModel } from './linked-projects.model';
import { LinkedProjectsState } from './linked-projects.state';

export class LinkedProjectsSelectors {
  @Selector([LinkedProjectsState])
  static getLinkedProjects(state: LinkedProjectsStateModel) {
    return state.linkedProjects.data;
  }

  @Selector([LinkedProjectsState])
  static getLinkedProjectsLoading(state: LinkedProjectsStateModel) {
    return state.linkedProjects.isLoading;
  }

  @Selector([LinkedProjectsState])
  static getLinkedProjectsTotalCount(state: LinkedProjectsStateModel) {
    return state.linkedProjects.totalCount;
  }
}
