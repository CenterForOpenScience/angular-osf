import { StateContext } from '@ngxs/store';

import { catchError, finalize, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { FilesService } from '@osf/shared/services';

import { CreateFolder, GetFiles, GetRootFolders } from '../registries.actions';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class FilesHandlers {
  filesService = inject(FilesService);

  getRootFolders(ctx: StateContext<RegistriesStateModel>, action: GetRootFolders) {
    const state = ctx.getState();
    ctx.patchState({ rootFolders: { ...state.rootFolders, isLoading: true, error: null }, currentFolder: null });

    return this.filesService.getFolders(action.folderLink).pipe(
      tap({
        next: (response) =>
          ctx.patchState({
            rootFolders: {
              data: response.files,
              isLoading: false,
              error: null,
            },
            currentFolder: response.files.length > 0 ? response.files[0] : null,
          }),
      }),
      catchError((error) => handleSectionError(ctx, 'rootFolders', error))
    );
  }

  getProjectFiles(ctx: StateContext<RegistriesStateModel>, { filesLink }: GetFiles) {
    const state = ctx.getState();
    ctx.patchState({
      files: {
        ...state.files,
        isLoading: true,
      },
    });

    return this.filesService.getFilesWithoutFiltering(filesLink).pipe(
      tap((response) => {
        ctx.patchState({
          files: {
            data: response,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'files', error))
    );
  }

  createFolder(ctx: StateContext<RegistriesStateModel>, action: CreateFolder) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.filesService
      .createFolder(action.newFolderLink, action.folderName)
      .pipe(finalize(() => ctx.patchState({ files: { ...state.files, isLoading: false, error: null } })));
  }
}
