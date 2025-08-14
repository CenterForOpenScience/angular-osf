import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';
import { FilesService, ToastService } from '@shared/services';

import { GetRegistryFiles, SetCurrentFolder, SetSearch, SetSort } from './registry-files.actions';
import { RegistryFilesStateModel } from './registry-files.model';

@Injectable()
@State<RegistryFilesStateModel>({
  name: 'registryFiles',
  defaults: {
    files: {
      data: [],
      isLoading: false,
      error: null,
    },
    search: '',
    sort: '',
    currentFolder: null,
  },
})
export class RegistryFilesState {
  private readonly filesService = inject(FilesService);
  private readonly toastService = inject(ToastService);

  @Action(GetRegistryFiles)
  getRegistryFiles(ctx: StateContext<RegistryFilesStateModel>, action: GetRegistryFiles) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.filesService.getFiles(action.filesLink, state.search, state.sort).pipe(
      tap({
        next: (files) => {
          ctx.patchState({
            files: {
              data: files,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => {
        this.toastService.showError(error);
        return handleSectionError(ctx, 'files', error);
      })
    );
  }

  @Action(SetCurrentFolder)
  setSelectedFolder(ctx: StateContext<RegistryFilesStateModel>, action: SetCurrentFolder) {
    ctx.patchState({ currentFolder: action.folder });
  }

  @Action(SetSearch)
  setSearch(ctx: StateContext<RegistryFilesStateModel>, action: SetSearch) {
    ctx.patchState({ search: action.search });
  }

  @Action(SetSort)
  setSort(ctx: StateContext<RegistryFilesStateModel>, action: SetSort) {
    ctx.patchState({ sort: action.sort });
  }
}
