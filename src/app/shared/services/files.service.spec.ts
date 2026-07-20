import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { AddonMapper } from '@osf/shared/mappers/addon.mapper';
import { FilesMapper } from '@osf/shared/mappers/files/files.mapper';
import { FileModel } from '@osf/shared/models/files/file.model';

import { FileModelMock } from '@testing/mocks/file.model.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { FilesService } from './files.service';
import { JsonApiService } from './json-api.service';

describe('FilesService', () => {
  let service: FilesService;
  let jsonApiService: JsonApiServiceMockType;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        FilesService,
        MockProvider(JsonApiService, jsonApiService),
        MockProvider(ENVIRONMENT, {
          apiDomainUrl: 'https://api.test',
          addonsApiUrl: 'https://addons.test',
          webUrl: 'https://web.test',
        }),
      ],
    });

    service = TestBed.inject(FilesService);
  }

  it('should create', () => {
    setup();
    expect(service).toBeTruthy();
    expect(service.apiUrl).toBe('https://api.test/v2');
    expect(service.addonsApiUrl).toBe('https://addons.test');
  });

  it('should request files with filtering params and map response', async () => {
    setup();
    const mappedFile = FileModelMock.simple({ id: 'mapped' });
    const mapperSpy = vi.spyOn(FilesMapper, 'getFiles').mockReturnValue([mappedFile]);
    jsonApiService.get.mockReturnValue(of({ data: [{ id: 'raw' }], meta: { total: 1 } }));

    const response = await firstValueFrom(service.getFiles('/files', 'term', '-name', 2));

    expect(jsonApiService.get).toHaveBeenCalledWith('/files', {
      sort: '-name',
      page: '2',
      'fields[files]': 'name,guid,kind,extra,size,path,materialized_path,date_modified,parent_folder,files',
      'filter[name]': 'term',
    });
    expect(mapperSpy).toHaveBeenCalledWith([{ id: 'raw' }]);
    expect(response.files).toEqual([mappedFile]);
    expect(response.meta).toEqual({ total: 1 });
  });

  it('should map resource type to root folders url', () => {
    setup();
    const getFoldersSpy = vi.spyOn(service, 'getFolders').mockReturnValue(of({ files: [] }));

    service.getRootFolders('abc', ResourceType.Project).subscribe();
    service.getRootFolders('abc', ResourceType.Registration).subscribe();
    service.getRootFolders('abc', ResourceType.Preprint).subscribe();

    expect(getFoldersSpy).toHaveBeenNthCalledWith(1, 'https://api.test/v2/nodes/abc/files/');
    expect(getFoldersSpy).toHaveBeenNthCalledWith(2, 'https://api.test/v2/registrations/abc/files/');
    expect(getFoldersSpy).toHaveBeenNthCalledWith(3, 'https://api.test/v2/preprints/abc/files/');
  });

  it('should upload file with create params and without params for update', () => {
    setup();
    const file = new File(['body'], 'a.txt');
    jsonApiService.putFile.mockReturnValue(of(new HttpResponse({ status: 200 })));

    service.uploadFile(file, '/upload').subscribe();
    service.uploadFile(file, '/upload', true).subscribe();

    expect(jsonApiService.putFile).toHaveBeenNthCalledWith(1, '/upload', file, {
      kind: 'file',
      name: 'a.txt',
    });
    expect(jsonApiService.putFile).toHaveBeenNthCalledWith(2, '/upload', file, undefined);
  });

  it('should post move file payload with optional replace conflict', () => {
    setup();
    jsonApiService.post.mockReturnValue(of({}));

    service.moveFile('/move', '/dest', 'node-1', 'osfstorage', 'move').subscribe();
    service.moveFile('/move', '/dest', 'node-1', 'osfstorage', 'move', true).subscribe();

    expect(jsonApiService.post).toHaveBeenNthCalledWith(1, '/move', {
      action: 'move',
      path: '/dest',
      provider: 'osfstorage',
      resource: 'node-1',
      conflict: undefined,
    });
    expect(jsonApiService.post).toHaveBeenNthCalledWith(2, '/move', {
      action: 'move',
      path: '/dest',
      provider: 'osfstorage',
      resource: 'node-1',
      conflict: 'replace',
    });
  });

  it('should build folder download link with correct separator', () => {
    setup();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(service.getFolderDownloadLink('/files/1')).toBe(`/files/1?zip=&source=&tz=${encodeURIComponent(timeZone)}`);
    expect(service.getFolderDownloadLink('/files/1?foo=bar')).toBe(
      `/files/1?foo=bar&zip=&source=&tz=${encodeURIComponent(timeZone)}`
    );
  });

  it('should return empty reference when addons api response has no data', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of({ data: [] }));

    const link = await firstValueFrom(service.getResourceReferences('https://web.test/resource'));
    expect(link).toBe('');
  });

  it('should return empty configured addons when reference url is empty', async () => {
    setup();
    vi.spyOn(service, 'getResourceReferences').mockReturnValue(of(''));

    const addons = await firstValueFrom(service.getConfiguredStorageAddons('node-1'));
    expect(addons).toEqual([]);
  });

  it('should fetch configured addons and map response', async () => {
    setup();
    vi.spyOn(service, 'getResourceReferences').mockReturnValue(of('https://addons.test/resource-ref'));
    const addonSpy = vi.spyOn(AddonMapper, 'fromConfiguredAddonResponse').mockReturnValue({ id: 'addon-1' } as never);
    jsonApiService.get.mockReturnValue(of({ data: [{ id: 'raw-addon' }] }));

    const addons = await firstValueFrom(service.getConfiguredStorageAddons('node-1'));

    expect(jsonApiService.get).toHaveBeenCalledWith('https://addons.test/resource-ref/configured_storage_addons');
    expect(addonSpy).toHaveBeenCalledWith({ id: 'raw-addon' });
    expect(addons).toEqual([{ id: 'addon-1' }]);
  });

  it('should fetch external storage service and map addon', async () => {
    setup();
    const addon = { id: 'service-1' };
    const addonSpy = vi.spyOn(AddonMapper, 'fromResponse').mockReturnValue(addon as never);
    jsonApiService.get.mockReturnValue(of({ data: { id: 'raw' } }));

    const result = await firstValueFrom(service.getExternalStorageService('service-1'));

    expect(jsonApiService.get).toHaveBeenCalledWith(
      'https://addons.test/configured-storage-addons/service-1/external_storage_service/'
    );
    expect(addonSpy).toHaveBeenCalledWith({ id: 'raw' });
    expect(result).toEqual(addon);
  });

  it('should call updateTags with correct patch payload', () => {
    setup();
    const fileDetails = FileModelMock.simple() as unknown as FileModel;
    const fileDetailsSpy = vi.spyOn(FilesMapper, 'getFileDetails').mockReturnValue(fileDetails as never);
    jsonApiService.patch.mockReturnValue(of({ id: 'file-1' }));

    service.updateTags(['one', 'two'], 'file-1').subscribe();

    expect(jsonApiService.patch).toHaveBeenCalledWith('https://api.test/v2/files/file-1/', {
      data: {
        id: 'file-1',
        type: 'files',
        relationships: {},
        attributes: { tags: ['one', 'two'] },
      },
    });
    expect(fileDetailsSpy).toHaveBeenCalledWith({ id: 'file-1' });
  });
});
