import { Action, State, StateContext } from '@ngxs/store';
import {
  insertItem,
  patch,
  removeItem,
  updateItem,
} from '@ngxs/store/operators';

import { of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { DeveloperApplicationsService } from '@osf/features/settings/developer-apps/developer-apps.service';
import { DeveloperApp } from '@osf/features/settings/developer-apps/entities/developer-apps.models';
import { DeveloperAppsStateModel } from '@osf/features/settings/developer-apps/store/developer-apps.state-model';

import {
  CreateDeveloperApp,
  DeleteDeveloperApp,
  GetDeveloperAppDetails,
  GetDeveloperApps,
  ResetClientSecret,
  UpdateDeveloperApp,
} from './developer-apps.actions';

@State<DeveloperAppsStateModel>({
  name: 'developerApps',
  defaults: {
    developerApps: [],
  },
})
@Injectable()
export class DeveloperAppsState {
  #developerAppsService = inject(DeveloperApplicationsService);

  @Action(GetDeveloperApps)
  getDeveloperApps(ctx: StateContext<DeveloperAppsStateModel>) {
    return this.#developerAppsService.getApplications().pipe(
      tap((developerApps) => {
        ctx.setState(patch({ developerApps }));
      }),
    );
  }

  @Action(GetDeveloperAppDetails)
  getDeveloperAppDetails(
    ctx: StateContext<DeveloperAppsStateModel>,
    action: GetDeveloperAppDetails,
  ) {
    const state = ctx.getState();
    const developerAppFromState = state.developerApps.find(
      (app: DeveloperApp) => app.clientId === action.clientId,
    );

    if (developerAppFromState) {
      return of(developerAppFromState);
    }

    return this.#developerAppsService
      .getApplicationDetails(action.clientId)
      .pipe(
        tap((fetchedApp) => {
          ctx.setState(
            patch({
              developerApps: insertItem(fetchedApp),
            }),
          );
        }),
      );
  }

  @Action(CreateDeveloperApp)
  createDeveloperApp(
    ctx: StateContext<DeveloperAppsStateModel>,
    action: CreateDeveloperApp,
  ) {
    return this.#developerAppsService
      .createApplication(action.developerAppCreate)
      .pipe(
        tap((newApp) => {
          ctx.setState(
            patch({
              developerApps: insertItem(newApp, 0),
            }),
          );
        }),
      );
  }

  @Action(UpdateDeveloperApp)
  updateDeveloperApp(
    ctx: StateContext<DeveloperAppsStateModel>,
    action: UpdateDeveloperApp,
  ) {
    return this.#developerAppsService
      .updateApp(action.clientId, action.developerAppUpdate)
      .pipe(
        tap((updatedApp) => {
          ctx.setState(
            patch({
              developerApps: updateItem<DeveloperApp>(
                (app) => app.clientId === action.clientId,
                updatedApp,
              ),
            }),
          );
        }),
      );
  }

  @Action(ResetClientSecret)
  resetClientSecret(
    ctx: StateContext<DeveloperAppsStateModel>,
    action: ResetClientSecret,
  ) {
    return this.#developerAppsService.resetClientSecret(action.clientId).pipe(
      tap((updatedApp) => {
        ctx.setState(
          patch({
            developerApps: updateItem<DeveloperApp>(
              (app) => app.clientId === action.clientId,
              updatedApp,
            ),
          }),
        );
      }),
    );
  }

  @Action(DeleteDeveloperApp)
  deleteDeveloperApp(
    ctx: StateContext<DeveloperAppsStateModel>,
    action: DeleteDeveloperApp,
  ) {
    return this.#developerAppsService.deleteApplication(action.clientId).pipe(
      tap(() => {
        ctx.setState(
          patch({
            developerApps: removeItem<DeveloperApp>(
              (app) => app.clientId === action.clientId,
            ),
          }),
        );
      }),
    );
  }
}
