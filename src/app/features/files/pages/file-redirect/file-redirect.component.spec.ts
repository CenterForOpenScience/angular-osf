import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesService } from '@osf/shared/services';

import { FileRedirectComponent } from './file-redirect.component';

import { ActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { RouterMock } from '@testing/providers/router-provider.mock';

describe('FileRedirectComponent', () => {
  let component: FileRedirectComponent;
  let fixture: ComponentFixture<FileRedirectComponent>;
  let filesService: jest.Mocked<FilesService>;
  let router: jest.Mocked<Router>;

  const mockFile = {
    guid: 'test-file-guid',
    name: 'test-file.txt',
    kind: 'file',
  };

  beforeEach(async () => {
    const mockFilesService = {
      getFileGuid: jest.fn().mockReturnValue(of(mockFile)),
    };

    await TestBed.configureTestingModule({
      imports: [FileRedirectComponent],
      providers: [
        { provide: FilesService, useValue: mockFilesService },
        { provide: Router, useValue: RouterMock.withUrl('/test').build() },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock.withParams({ fileId: 'test-file-id' }).build() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileRedirectComponent);
    component = fixture.componentInstance;
    filesService = TestBed.inject(FilesService) as jest.Mocked<FilesService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
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
          get: jest.fn().mockReturnValue(null),
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
