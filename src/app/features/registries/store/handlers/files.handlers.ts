import { StateContext } from '@ngxs/store';

import { catchError, finalize, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';
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
        next: (folders) =>
          ctx.patchState({
            rootFolders: {
              data: folders,
              isLoading: false,
              error: null,
            },
            currentFolder: folders.length > 0 ? folders[0] : null,
          }),
      }),
      catchError((error) => handleSectionError(ctx, 'rootFolders', error))
    );
  }

  getProjectFiles(ctx: StateContext<RegistriesStateModel>, { filesLink }: GetFiles) {
    const state = ctx.getState();
    console.log('Fetching project files from:', filesLink);
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
