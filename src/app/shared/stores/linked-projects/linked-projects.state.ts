import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';
import { LinkedProjectsService } from '@shared/services/linked-projects.service';

import { ClearLinkedProjects, GetAllLinkedProjects } from './linked-projects.actions';
import { LINKED_PROJECTS_DEFAULTS, LinkedProjectsStateModel } from './linked-projects.model';

@State<LinkedProjectsStateModel>({
  name: 'linkedProjects',
  defaults: LINKED_PROJECTS_DEFAULTS,
})
@Injectable()
export class LinkedProjectsState {
  linkedProjectsService = inject(LinkedProjectsService);

  @Action(GetAllLinkedProjects)
  getLinkedProjects(ctx: StateContext<LinkedProjectsStateModel>, action: GetAllLinkedProjects) {
    const state = ctx.getState();
    ctx.patchState({
      linkedProjects: {
        ...state.linkedProjects,
        isLoading: true,
      },
    });

    return this.linkedProjectsService
      .fetchAllLinkedProjects(action.resourceId, action.resourceType, action.page, action.pageSize)
      .pipe(
        tap((response) => {
          ctx.patchState({
            linkedProjects: {
              data: response.data,
              isLoading: false,
              error: null,
              totalCount: response.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'linkedProjects', error))
      );
  }

  @Action(ClearLinkedProjects)
  clearLinkedProjects(ctx: StateContext<LinkedProjectsStateModel>) {
    ctx.patchState(LINKED_PROJECTS_DEFAULTS);
  }
}
