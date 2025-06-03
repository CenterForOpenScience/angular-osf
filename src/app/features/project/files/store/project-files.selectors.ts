import { Selector } from '@ngxs/store';

import { OsfFile } from '@osf/features/project/files/models';
import { OsfFileCustomMetadata } from '@osf/features/project/files/models/osf-models/file-custom-metadata.model';
import { OsfFileProjectContributor } from '@osf/features/project/files/models/osf-models/file-project-contributor.model';
import { OsfProjectMetadata } from '@osf/features/project/files/models/osf-models/project-custom-metadata.model';
import { AsyncStateModel } from '@shared/models';

import { ProjectFilesStateModel } from './project-files.model';
import { ProjectFilesState } from './project-files.state';

export class ProjectFilesSelectors {
  @Selector([ProjectFilesState])
  static getFiles(state: ProjectFilesStateModel): AsyncStateModel<OsfFile[]> {
    return state.files;
  }

  @Selector([ProjectFilesState])
  static getMoveFileFiles(state: ProjectFilesStateModel): AsyncStateModel<OsfFile[]> {
    return state.moveFileFiles;
  }

  @Selector([ProjectFilesState])
  static getCurrentFolder(state: ProjectFilesStateModel): OsfFile | undefined {
    return state.currentFolder;
  }

  @Selector([ProjectFilesState])
  static getMoveFileCurrentFolder(state: ProjectFilesStateModel): OsfFile | undefined {
    return state.moveFileCurrentFolder;
  }

  @Selector([ProjectFilesState])
  static getProvider(state: ProjectFilesStateModel): string {
    return state.provider;
  }

  @Selector([ProjectFilesState])
  static getOpenedFile(state: ProjectFilesStateModel): AsyncStateModel<OsfFile | null> {
    return state.openedFile;
  }

  @Selector([ProjectFilesState])
  static getFileCustomMetadata(state: ProjectFilesStateModel): AsyncStateModel<OsfFileCustomMetadata | null> {
    return state.fileMetadata;
  }

  @Selector([ProjectFilesState])
  static isFileMetadataLoading(state: ProjectFilesStateModel): boolean {
    return state.fileMetadata.isLoading;
  }

  @Selector([ProjectFilesState])
  static getProjectMetadata(state: ProjectFilesStateModel): OsfProjectMetadata | null {
    return state.projectMetadata.data;
  }

  @Selector([ProjectFilesState])
  static getProjectContributors(state: ProjectFilesStateModel): OsfFileProjectContributor[] | null {
    return state.contributors.data;
  }
}
