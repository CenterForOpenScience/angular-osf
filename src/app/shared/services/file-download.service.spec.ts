import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesService } from '@osf/shared/services/files.service';

import { FileModelMock } from '@testing/mocks/file.model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { DataciteServiceMock, DataciteServiceMockType } from '@testing/providers/datacite.service.mock';
import { FilesServiceMock, FilesServiceMockType } from '@testing/providers/files-service.mock';

import { FileDownloadService } from './file-download.service';

describe('FileDownloadService', () => {
  let service: FileDownloadService;
  let dataciteService: DataciteServiceMockType;
  let filesService: FilesServiceMockType;

  beforeEach(() => {
    dataciteService = DataciteServiceMock.simple();
    filesService = FilesServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(DataciteService, dataciteService),
        MockProvider(FilesService, filesService),
      ],
    });

    service = TestBed.inject(FileDownloadService);
  });

  it('logs datacite and opens folder zip link', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);
    filesService.getFolderDownloadLink.mockReturnValue('/folder/download/?zip=');

    service.downloadFolderAsZip({
      resourceId: 'node-1',
      resourceType: 'nodes',
      downloadLink: '/folder/download/',
    });

    expect(dataciteService.logFileDownload).toHaveBeenCalledWith('node-1', 'nodes');
    expect(filesService.getFolderDownloadLink).toHaveBeenCalledWith('/folder/download/');
    expect(openSpy).toHaveBeenCalledWith('/folder/download/?zip=', '_blank');
  });

  it('does not download folder zip when resource id is missing', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    service.downloadFolderAsZip({
      resourceId: '',
      resourceType: 'nodes',
      downloadLink: '/folder/download/',
    });

    expect(dataciteService.logFileDownload).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('logs datacite and opens file download link', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);

    service.downloadFile({
      resourceId: 'node-1',
      resourceType: 'nodes',
      downloadLink: '/file/download/',
    });

    expect(dataciteService.logFileDownload).toHaveBeenCalledWith('node-1', 'nodes');
    expect(openSpy).toHaveBeenCalledWith('/file/download/', '_blank');
  });

  it('downloads file from file model', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);
    const file = FileModelMock.simple({
      kind: FileKind.File,
      links: { ...FileModelMock.simple().links, download: '/file/download/' },
    });

    service.downloadFileOrFolder({
      resourceId: 'node-1',
      resourceType: 'nodes',
      file,
    });

    expect(dataciteService.logFileDownload).toHaveBeenCalledWith('node-1', 'nodes');
    expect(openSpy).toHaveBeenCalledWith('/file/download/', '_blank');
  });

  it('downloads folder zip from file model', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);
    filesService.getFolderDownloadLink.mockReturnValue('/folder/upload/?zip=');
    const file = FileModelMock.simple({
      kind: FileKind.Folder,
      links: { ...FileModelMock.simple().links, upload: '/folder/upload/' },
    });

    service.downloadFileOrFolder({
      resourceId: 'node-1',
      resourceType: 'nodes',
      file,
    });

    expect(dataciteService.logFileDownload).toHaveBeenCalledWith('node-1', 'nodes');
    expect(filesService.getFolderDownloadLink).toHaveBeenCalledWith('/folder/upload/');
    expect(openSpy).toHaveBeenCalledWith('/folder/upload/?zip=', '_blank');
  });
});
