import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { FileProvider } from '@osf/features/files/constants';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { getConfiguredStorageAddonDisplayName } from '@osf/shared/helpers/storage-addon-options.helper';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileDownloadService } from '@osf/shared/services/file-download.service';
import { FilesService } from '@osf/shared/services/files.service';
import { MetadataRecordsService } from '@osf/shared/services/metadata-records.service';

import { METADATA_DOWNLOAD_OPTION } from '../constants/metadata-download-option.const';
import { ProjectDownloadOption } from '../models/project-download-option.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectDownloadOptionsService {
  private readonly filesService = inject(FilesService);
  private readonly metadataRecordsService = inject(MetadataRecordsService);
  private readonly fileDownloadService = inject(FileDownloadService);

  private readonly optionsCache = new Map<string, ProjectDownloadOption[]>();

  loadOptions(projectId: string): Observable<ProjectDownloadOption[]> {
    const cached = this.optionsCache.get(projectId);

    if (cached) {
      return of(cached);
    }

    return this.fetchOptions(projectId);
  }

  clearCache(): void {
    this.optionsCache.clear();
  }

  executeDownload(projectId: string, option: ProjectDownloadOption): void {
    if (option.type === 'metadata') {
      this.metadataRecordsService.downloadMetadata(projectId);
      return;
    }

    if (!option.downloadLink) {
      return;
    }

    this.fileDownloadService.downloadFolderAsZip({
      resourceId: projectId,
      resourceType: CurrentResourceType.Projects,
      downloadLink: option.downloadLink,
    });
  }

  private fetchOptions(projectId: string): Observable<ProjectDownloadOption[]> {
    return forkJoin({
      rootFoldersResponse: this.filesService.getRootFolders(projectId, ResourceType.Project),
      configuredAddons: this.filesService.getConfiguredStorageAddons(projectId),
    }).pipe(
      switchMap(({ rootFoldersResponse, configuredAddons }) =>
        this.buildOptions(rootFoldersResponse.data, configuredAddons)
      ),
      map((options) => {
        this.optionsCache.set(projectId, options);

        return options;
      })
    );
  }

  private buildOptions(
    rootFolders: FileFolderModel[],
    configuredAddons: ConfiguredAddonModel[]
  ): Observable<ProjectDownloadOption[]> {
    const osfFolder = rootFolders.find((folder) => folder.provider === FileProvider.OsfStorage);

    if (!osfFolder?.links.filesLink) {
      return of([METADATA_DOWNLOAD_OPTION, ...this.createAddonOptions(rootFolders, configuredAddons)]);
    }

    return this.filesService.getFilesWithoutFiltering(osfFolder.links.filesLink, 1).pipe(
      map((filesResponse) => {
        const options = [METADATA_DOWNLOAD_OPTION];

        if (filesResponse.totalCount > 0 && osfFolder.links.download) {
          options.push({
            id: 'osf-files',
            label: 'myProjects.table.download.files',
            type: 'osf-files',
            downloadLink: osfFolder.links.download,
          });
        }

        return [...options, ...this.createAddonOptions(rootFolders, configuredAddons)];
      })
    );
  }

  private createAddonOptions(
    rootFolders: FileFolderModel[],
    configuredAddons: ConfiguredAddonModel[]
  ): ProjectDownloadOption[] {
    const options: ProjectDownloadOption[] = [];

    for (const folder of rootFolders) {
      if (folder.provider === FileProvider.OsfStorage) {
        continue;
      }

      const addonName = getConfiguredStorageAddonDisplayName(configuredAddons, folder.provider, '');

      if (!addonName || !folder.links.download) {
        continue;
      }

      options.push({
        id: `addon-${folder.provider}`,
        label: 'myProjects.table.download.addonFiles',
        labelParams: { addonName },
        type: 'addon',
        downloadLink: folder.links.download,
      });
    }

    return options;
  }
}
