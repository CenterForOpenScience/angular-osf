import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { map, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { MyProjectsService } from '@osf/features/my-projects/services';
import { PaginatedViewOnlyLinksModel, ProjectSettingsModel } from '@osf/features/project/settings/models';
import { SettingsService, ViewOnlyLinksService } from '@osf/features/project/settings/services';
import {
  CreateViewOnlyLink,
  DeleteViewOnlyLink,
  GetProjectDetails,
  GetProjectSettings,
  GetViewOnlyLinksTable,
  UpdateProjectDetails,
  UpdateProjectSettings,
} from '@osf/features/project/settings/store/settings.actions';
import { SettingsStateModel } from '@osf/features/project/settings/store/settings.model';
import { NodeData } from '@shared/models';

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    settings: {
      data: {} as ProjectSettingsModel,
      isLoading: false,
      error: null,
    },
    projectDetails: {
      data: {} as NodeData,
      isLoading: false,
      error: null,
    },
    viewOnlyLinks: {
      data: {} as PaginatedViewOnlyLinksModel,
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class SettingsState {
  private readonly settingsService = inject(SettingsService);
  private readonly myProjectService = inject(MyProjectsService);
  private readonly viewOnlyLinksService = inject(ViewOnlyLinksService);

  private readonly REFRESH_INTERVAL = 5 * 60 * 1000;

  private shouldRefresh(lastFetched?: number): boolean {
    return !lastFetched || Date.now() - lastFetched > this.REFRESH_INTERVAL;
  }

  private handleError(ctx: StateContext<SettingsStateModel>, section: keyof SettingsStateModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }

  @Action(GetProjectSettings)
  getProjectSettings(ctx: StateContext<SettingsStateModel>, action: GetProjectSettings) {
    const state = ctx.getState();
    const cached = state.settings.data;
    const shouldRefresh = this.shouldRefresh(cached.lastFetched);

    if (cached.id === action.projectId && !shouldRefresh) {
      return of(cached).pipe(
        tap(() =>
          ctx.patchState({
            settings: { ...state.settings, isLoading: false, error: null },
          })
        )
      );
    }

    ctx.patchState({
      settings: { ...state.settings, isLoading: true, error: null },
    });

    return this.settingsService.getProjectSettings(action.projectId).pipe(
      tap((settings) => {
        settings.lastFetched = Date.now();
        ctx.patchState({
          settings: {
            data: settings,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'settings', error))
    );
  }

  @Action(GetProjectDetails)
  getProjectDetails(ctx: StateContext<SettingsStateModel>, action: GetProjectDetails) {
    const state = ctx.getState();
    const cached = state.projectDetails.data;
    const shouldRefresh = this.shouldRefresh(cached.lastFetched);

    if (cached.id === action.projectId && !shouldRefresh) {
      return of(cached).pipe(
        tap(() =>
          ctx.patchState({
            projectDetails: { ...state.projectDetails, isLoading: false, error: null },
          })
        )
      );
    }

    ctx.patchState({
      projectDetails: { ...state.projectDetails, isLoading: true, error: null },
    });

    return this.myProjectService.getProjectById(action.projectId).pipe(
      map((response) => response?.data as NodeData),
      tap((details) => {
        const updatedDetails = {
          ...details,
          lastFetched: Date.now(),
        };

        ctx.patchState({
          projectDetails: {
            data: updatedDetails,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'projectDetails', error))
    );
  }

  @Action(GetViewOnlyLinksTable)
  getViewOnlyLinksTable(ctx: StateContext<SettingsStateModel>, action: GetViewOnlyLinksTable) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    return this.viewOnlyLinksService.getViewOnlyLinksData(action.projectId).pipe(
      map((response) => response),
      tap((links) => {
        ctx.patchState({
          viewOnlyLinks: {
            data: links,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'viewOnlyLinks', error))
    );
  }

  @Action(UpdateProjectDetails)
  updateProjectDetails(ctx: StateContext<SettingsStateModel>, action: UpdateProjectDetails) {
    return this.myProjectService.updateProjectById(action.payload).pipe(
      tap((updatedProject) => {
        ctx.patchState({
          projectDetails: {
            ...ctx.getState().projectDetails,
            data: updatedProject.data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'projectDetails', error))
    );
  }

  @Action(UpdateProjectSettings)
  updateProjectSettings(ctx: StateContext<SettingsStateModel>, action: UpdateProjectSettings) {
    const prev = ctx.getState().settings;

    return this.settingsService.updateProjectSettings(action.payload).pipe(
      tap((updatedSettings) => {
        updatedSettings.lastFetched = Date.now();
        ctx.patchState({
          settings: {
            ...prev,
            data: updatedSettings,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          settings: {
            ...prev,
            data: { ...prev.data },
            isLoading: false,
            error: error?.message,
          },
        });
        return this.handleError(ctx, 'settings', error);
      })
    );
  }

  @Action(CreateViewOnlyLink)
  createViewOnlyLink(ctx: StateContext<SettingsStateModel>, action: CreateViewOnlyLink) {
    const state = ctx.getState();
    return this.viewOnlyLinksService.createViewOnlyLink(action.projectId, action.payload).pipe(
      tap((data: PaginatedViewOnlyLinksModel) => {
        ctx.patchState({
          viewOnlyLinks: {
            data: {
              ...state.viewOnlyLinks.data,
              items: [data.items[0], ...state.viewOnlyLinks.data.items],
            },
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'viewOnlyLinks', error))
    );
  }

  @Action(DeleteViewOnlyLink)
  deleteViewOnlyLink(ctx: StateContext<SettingsStateModel>, action: DeleteViewOnlyLink) {
    return this.viewOnlyLinksService.deleteLink(action.projectId, action.linkId).pipe(
      tap(() => {
        ctx.setState(
          patch({
            viewOnlyLinks: {
              data: {
                ...ctx.getState().viewOnlyLinks.data,
                items: ctx.getState().viewOnlyLinks.data.items.filter((item) => item.id !== action.linkId),
              },
              isLoading: false,
              error: null,
            },
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'viewOnlyLinks', error))
    );
  }
}
