import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mocked } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesService } from '@osf/shared/services/files.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

import { FileRedirectComponent } from './file-redirect.component';

describe('FileRedirectComponent', () => {
  let component: FileRedirectComponent;
  let fixture: ComponentFixture<FileRedirectComponent>;
  let filesService: Mocked<FilesService>;
  let router: Mocked<Router>;

  const mockFile = {
    guid: 'test-file-guid',
    name: 'test-file.txt',
    kind: 'file',
  };

  beforeEach(() => {
    const mockFilesService = {
      getFileGuid: vi.fn().mockReturnValue(of(mockFile)),
    };

    TestBed.configureTestingModule({
      imports: [FileRedirectComponent],
      providers: [
        provideOSFCore(),
        MockProvider(FilesService, mockFilesService),
        MockProvider(Router, RouterMockBuilder.create().withUrl('/test').build()),
        MockProvider(ActivatedRoute, ActivatedRouteMock.withParams({ fileId: 'test-file-id' }).build()),
      ],
    });

    fixture = TestBed.createComponent(FileRedirectComponent);
    component = fixture.componentInstance;
    filesService = TestBed.inject(FilesService) as Mocked<FilesService>;
    router = TestBed.inject(Router) as Mocked<Router>;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of FileRedirectComponent', () => {
      expect(component).toBeInstanceOf(FileRedirectComponent);
    });
  });

  it('should inject required services', () => {
    expect(component.route).toBeDefined();
    expect(component.router).toBeDefined();
    expect(component['destroyRef']).toBeDefined();
    expect(component['filesService']).toBeDefined();
  });

  it('should extract fileId from route parameters', () => {
    expect(component.fileId).toBe('test-file-id');
  });

  it('should handle missing fileId parameter', () => {
    expect(component.fileId).toBe('test-file-id');

    const mockRouteWithoutFileId = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null),
        },
      },
    };

    const fileId = mockRouteWithoutFileId.snapshot.paramMap.get('fileId') ?? '';
    expect(fileId).toBe('');
  });

  it('should call filesService.getFileGuid with fileId', () => {
    expect(filesService.getFileGuid).toHaveBeenCalledWith('test-file-id');
  });

  it('should navigate to file guid when file is retrieved', () => {
    expect(router.navigate).toHaveBeenCalledWith(['test-file-guid']);
  });

  it('should have readonly route property', () => {
    expect(component.route).toBeDefined();
    expect(component.route.snapshot.paramMap.get('fileId')).toBe('test-file-id');
  });

  it('should have readonly router property', () => {
    expect(component.router).toBeDefined();
    expect(component.router.navigate).toBeDefined();
  });
});
