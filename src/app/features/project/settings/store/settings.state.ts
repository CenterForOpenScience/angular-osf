import { Action, State, StateContext } from '@ngxs/store';

import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';

import { SettingsService } from '../services';

import {
  DeleteInstitution,
  DeleteProject,
  GetProjectDetails,
  GetProjectSettings,
  UpdateProjectDetails,
  UpdateProjectSettings,
} from './settings.actions';
import { SETTINGS_STATE_DEFAULTS, SettingsStateModel } from './settings.model';

@State<SettingsStateModel>({
  name: 'settings',
  defaults: SETTINGS_STATE_DEFAULTS,
})
@Injectable()
export class SettingsState {
  private readonly settingsService = inject(SettingsService);
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000;

  private shouldRefresh(lastFetched?: number): boolean {
    return !lastFetched || Date.now() - lastFetched > this.REFRESH_INTERVAL;
  }

  @Action(GetProjectSettings)
  getProjectSettings(ctx: StateContext<SettingsStateModel>, action: GetProjectSettings) {
    const state = ctx.getState();
    const cached = state.settings.data;
    const shouldRefresh = this.shouldRefresh(cached.lastFetched);

    if (cached.id === action.projectId && !shouldRefresh) {
      return of(cached).pipe(
        tap(() => ctx.patchState({ settings: { ...state.settings, isLoading: false, error: null } }))
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
      catchError((error) => handleSectionError(ctx, 'settings', error))
    );
  }

  @Action(GetProjectDetails)
  getProjectDetails(ctx: StateContext<SettingsStateModel>, action: GetProjectDetails) {
    const state = ctx.getState();

    ctx.patchState({ projectDetails: { ...state.projectDetails, isLoading: true, error: null } });

    return this.settingsService.getProjectById(action.projectId).pipe(
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
      catchError((error) => handleSectionError(ctx, 'projectDetails', error))
    );
  }

  @Action(UpdateProjectDetails)
  updateProjectDetails(ctx: StateContext<SettingsStateModel>, action: UpdateProjectDetails) {
    return this.settingsService.updateProjectById(action.payload).pipe(
      tap((updatedProject) => {
        ctx.patchState({
          projectDetails: {
            ...ctx.getState().projectDetails,
            data: updatedProject,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'projectDetails', error))
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
        return handleSectionError(ctx, 'settings', error);
      })
    );
  }

  @Action(DeleteProject)
  deleteProject(ctx: StateContext<SettingsStateModel>, action: DeleteProject) {
    return this.settingsService.deleteProject(action.projectId);
  }

  @Action(DeleteInstitution)
  deleteInstitution(ctx: StateContext<SettingsStateModel>, action: DeleteInstitution) {
    return this.settingsService.deleteInstitution(action.institutionId, action.projectId);
  }
}
