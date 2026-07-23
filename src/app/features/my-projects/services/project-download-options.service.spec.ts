import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { FileProvider } from '@osf/features/files/constants';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileDownloadService } from '@osf/shared/services/file-download.service';
import { FilesService } from '@osf/shared/services/files.service';
import { MetadataRecordsService } from '@osf/shared/services/metadata-records.service';

import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { FileDownloadServiceMock, FileDownloadServiceMockType } from '@testing/providers/file-download-service.mock';
import { FilesServiceMock, FilesServiceMockType } from '@testing/providers/files-service.mock';

import { ProjectDownloadOptionsService } from './project-download-options.service';

describe('ProjectDownloadOptionsService', () => {
  let service: ProjectDownloadOptionsService;
  let filesService: FilesServiceMockType;
  let metadataRecordsService: Pick<MetadataRecordsService, 'downloadMetadata'>;
  let fileDownloadService: FileDownloadServiceMockType;

  const osfFolder: FileFolderModel = {
    ...OSF_FILE_MOCK,
    id: 'osf-root',
    provider: FileProvider.OsfStorage,
    links: {
      ...OSF_FILE_MOCK.links,
      filesLink: '/osf-files-link',
      download: '/osf-download-link',
    },
  };

  const googleDriveFolder: FileFolderModel = {
    ...OSF_FILE_MOCK,
    id: 'gdrive-root',
    provider: FileProvider.GoogleDrive,
    links: {
      ...OSF_FILE_MOCK.links,
      download: '/gdrive-download-link',
    },
  };

  const googleDriveAddon = {
    ...MOCK_CONFIGURED_ADDON,
    externalServiceName: FileProvider.GoogleDrive,
    displayName: 'My Google Drive',
  };

  beforeEach(() => {
    filesService = FilesServiceMock.simple();
    filesService.getRootFolders.mockReturnValue(
      of({ data: [osfFolder, googleDriveFolder], totalCount: 2, pageSize: 10 })
    );
    filesService.getConfiguredStorageAddons.mockReturnValue(of([googleDriveAddon]));
    filesService.getFilesWithoutFiltering.mockReturnValue(of({ data: [], totalCount: 2, pageSize: 10 }));

    metadataRecordsService = { downloadMetadata: vi.fn() };
    fileDownloadService = FileDownloadServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        ProjectDownloadOptionsService,
        MockProvider(FilesService, filesService),
        MockProvider(MetadataRecordsService, metadataRecordsService),
        MockProvider(FileDownloadService, fileDownloadService),
      ],
    });

    service = TestBed.inject(ProjectDownloadOptionsService);
  });

  it('should include metadata, osf files, and connected addon options', async () => {
    const options = await firstValueFrom(service.loadOptions('project-1'));

    expect(filesService.getRootFolders).toHaveBeenCalledWith('project-1', ResourceType.Project);
    expect(filesService.getConfiguredStorageAddons).toHaveBeenCalledWith('project-1');
    expect(filesService.getFilesWithoutFiltering).toHaveBeenCalledWith('/osf-files-link', 1);
    expect(options).toEqual([
      expect.objectContaining({ id: 'metadata', type: 'metadata' }),
      expect.objectContaining({
        id: 'osf-files',
        type: 'osf-files',
        label: 'myProjects.table.download.files',
        downloadLink: '/osf-download-link',
      }),
      expect.objectContaining({
        id: `addon-${FileProvider.GoogleDrive}`,
        type: 'addon',
        label: 'myProjects.table.download.addonFiles',
        labelParams: { addonName: 'My Google Drive' },
        downloadLink: '/gdrive-download-link',
      }),
    ]);
  });

  it('should hide osf files option when project has no files', async () => {
    filesService.getFilesWithoutFiltering.mockReturnValue(of({ data: [], totalCount: 0, pageSize: 10 }));

    const options = await firstValueFrom(service.loadOptions('project-1'));

    expect(options.some((option) => option.type === 'osf-files')).toBe(false);
    expect(options.some((option) => option.type === 'metadata')).toBe(true);
  });

  it('should skip osf file count request when osf folder has no filesLink', async () => {
    const { filesLink: _filesLink, ...osfLinksWithoutFilesLink } = osfFolder.links;
    const osfFolderWithoutFilesLink = {
      ...osfFolder,
      links: osfLinksWithoutFilesLink,
    } as FileFolderModel;
    filesService.getRootFolders.mockReturnValue(
      of({ data: [osfFolderWithoutFilesLink, googleDriveFolder], totalCount: 2, pageSize: 10 })
    );

    await firstValueFrom(service.loadOptions('project-1'));

    expect(filesService.getFilesWithoutFiltering).not.toHaveBeenCalled();
  });

  it('should omit addon option when configured addon has no display name', async () => {
    filesService.getConfiguredStorageAddons.mockReturnValue(of([]));

    const options = await firstValueFrom(service.loadOptions('project-1'));

    expect(options.some((option) => option.type === 'addon')).toBe(false);
  });

  it('should download metadata', () => {
    service.executeDownload('project-1', {
      id: 'metadata',
      label: 'myProjects.table.download.metadata',
      type: 'metadata',
    });

    expect(metadataRecordsService.downloadMetadata).toHaveBeenCalledWith('project-1');
    expect(fileDownloadService.downloadFolderAsZip).not.toHaveBeenCalled();
  });

  it('should download osf files as zip', () => {
    service.executeDownload('project-1', {
      id: 'osf-files',
      label: 'myProjects.table.download.files',
      type: 'osf-files',
      downloadLink: '/osf-download-link',
    });

    expect(fileDownloadService.downloadFolderAsZip).toHaveBeenCalledWith({
      resourceId: 'project-1',
      resourceType: CurrentResourceType.Projects,
      downloadLink: '/osf-download-link',
    });
  });

  it('should download addon files as zip', () => {
    service.executeDownload('project-1', {
      id: `addon-${FileProvider.GoogleDrive}`,
      label: 'myProjects.table.download.addonFiles',
      type: 'addon',
      downloadLink: '/gdrive-download-link',
    });

    expect(fileDownloadService.downloadFolderAsZip).toHaveBeenCalledWith({
      resourceId: 'project-1',
      resourceType: CurrentResourceType.Projects,
      downloadLink: '/gdrive-download-link',
    });
  });

  it('should not download zip when downloadLink is missing', () => {
    service.executeDownload('project-1', {
      id: 'osf-files',
      label: 'myProjects.table.download.files',
      type: 'osf-files',
    });

    expect(fileDownloadService.downloadFolderAsZip).not.toHaveBeenCalled();
  });

  it('should return cached options without refetching', async () => {
    await firstValueFrom(service.loadOptions('project-1'));
    filesService.getRootFolders.mockClear();
    filesService.getConfiguredStorageAddons.mockClear();
    filesService.getFilesWithoutFiltering.mockClear();

    await firstValueFrom(service.loadOptions('project-1'));

    expect(filesService.getRootFolders).not.toHaveBeenCalled();
    expect(filesService.getConfiguredStorageAddons).not.toHaveBeenCalled();
    expect(filesService.getFilesWithoutFiltering).not.toHaveBeenCalled();
  });

  it('should refetch options after cache is cleared', async () => {
    await firstValueFrom(service.loadOptions('project-1'));
    service.clearCache();
    filesService.getRootFolders.mockClear();

    await firstValueFrom(service.loadOptions('project-1'));

    expect(filesService.getRootFolders).toHaveBeenCalledWith('project-1', ResourceType.Project);
  });
});
