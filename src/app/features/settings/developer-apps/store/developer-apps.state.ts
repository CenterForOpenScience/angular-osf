import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { catchError, of, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { DeveloperApp } from '../models';
import { DeveloperApplicationsService } from '../services';

import {
  CreateDeveloperApp,
  DeleteDeveloperApp,
  GetDeveloperAppDetails,
  GetDeveloperApps,
  ResetClientSecret,
  UpdateDeveloperApp,
} from './developer-apps.actions';
import { DeveloperAppsStateModel } from './developer-apps.state-model';

@State<DeveloperAppsStateModel>({
  name: 'developerApps',
  defaults: {
    data: [],
    isLoading: false,
    error: null,
  },
})
@Injectable()
export class DeveloperAppsState {
  private readonly developerAppsService = inject(DeveloperApplicationsService);

  @Action(GetDeveloperApps)
  getDeveloperApps(ctx: StateContext<DeveloperAppsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ ...state.data, isLoading: true, error: null });

    return this.developerAppsService.getApplications().pipe(
      tap((developerApps) => {
        ctx.setState(patch({ data: developerApps, isLoading: false, error: null }));
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(GetDeveloperAppDetails)
  getDeveloperAppDetails(ctx: StateContext<DeveloperAppsStateModel>, action: GetDeveloperAppDetails) {
    const state = ctx.getState();
    const developerAppFromState = state.data.find((app: DeveloperApp) => app.clientId === action.clientId);

    if (developerAppFromState) {
      return of(developerAppFromState);
    }

    return this.developerAppsService.getApplicationDetails(action.clientId).pipe(
      tap((fetchedApp) => {
        ctx.setState(
          patch({
            data: insertItem<DeveloperApp>(fetchedApp),
            isLoading: false,
            error: null,
          })
        );
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(CreateDeveloperApp)
  createDeveloperApp(ctx: StateContext<DeveloperAppsStateModel>, action: CreateDeveloperApp) {
    const state = ctx.getState();
    ctx.patchState({ ...state.data, isLoading: true, error: null });

    return this.developerAppsService.createApplication(action.developerAppCreate).pipe(
      tap((newApp) => {
        ctx.setState(
          patch({
            data: insertItem<DeveloperApp>(newApp, 0),
            isLoading: false,
            error: null,
          })
        );
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(UpdateDeveloperApp)
  updateDeveloperApp(ctx: StateContext<DeveloperAppsStateModel>, action: UpdateDeveloperApp) {
    const state = ctx.getState();
    ctx.patchState({ ...state.data, isLoading: true, error: null });

    return this.developerAppsService.updateApp(action.clientId, action.developerAppUpdate).pipe(
      tap((updatedApp) => {
        ctx.setState(
          patch({
            data: updateItem<DeveloperApp>((app) => app.clientId === action.clientId, updatedApp),
            isLoading: false,
            error: null,
          })
        );
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(ResetClientSecret)
  resetClientSecret(ctx: StateContext<DeveloperAppsStateModel>, action: ResetClientSecret) {
    return this.developerAppsService.resetClientSecret(action.clientId).pipe(
      tap((updatedApp) => {
        ctx.setState(
          patch({
            data: updateItem<DeveloperApp>((app) => app.clientId === action.clientId, updatedApp),
            isLoading: false,
            error: null,
          })
        );
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(DeleteDeveloperApp)
  deleteDeveloperApp(ctx: StateContext<DeveloperAppsStateModel>, action: DeleteDeveloperApp) {
    const state = ctx.getState();
    ctx.patchState({ ...state.data, isLoading: true, error: null });

    return this.developerAppsService.deleteApplication(action.clientId).pipe(
      tap(() => {
        ctx.setState(
          patch({
            data: removeItem<DeveloperApp>((app) => app.clientId === action.clientId),
            isLoading: false,
            error: null,
          })
        );
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  private handleError(ctx: StateContext<DeveloperAppsStateModel>, error: Error) {
    ctx.patchState({
      ...ctx.getState().data,
      isLoading: false,
      error: error.message,
    });
    return throwError(() => error);
  }
}
