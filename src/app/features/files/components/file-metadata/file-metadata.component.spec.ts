import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { languageCodes } from '@osf/shared/constants';
import { CustomDialogService } from '@osf/shared/services';

import { FileMetadataFields } from '../../constants';
import { PatchFileMetadata } from '../../models';
import { FilesSelectors } from '../../store';

import { FileMetadataComponent } from './file-metadata.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMock } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { RouterMock } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('FileMetadataComponent', () => {
  let component: FileMetadataComponent;
  let fixture: ComponentFixture<FileMetadataComponent>;
  let customDialogService: any;

  const mockFileMetadata = {
    id: 'file-123',
    title: 'Test File',
    description: 'Test Description',
    resourceTypeGeneral: 'Dataset',
    language: 'en',
  };

  beforeEach(async () => {
    customDialogService = CustomDialogServiceMock.simple();

    await TestBed.configureTestingModule({
      imports: [FileMetadataComponent, OSFTestingModule],
      providers: [
        { provide: CustomDialogService, useValue: customDialogService },
        { provide: Router, useValue: RouterMock.withUrl('/test').build() },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock.withParams({ fileGuid: 'test-guid' }).build() },
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getFileCustomMetadata, value: signal(mockFileMetadata) },
            { selector: FilesSelectors.isFileMetadataLoading, value: signal(false) },
            { selector: FilesSelectors.hasWriteAccess, value: signal(true) },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.fileMetadata).toBeDefined();
    expect(component.isLoading).toBeDefined();
    expect(component.hasWriteAccess).toBeDefined();
    expect(component.languageCodes).toBe(languageCodes);
    expect(component.metadataFields).toBe(FileMetadataFields);
  });

  it('should get file metadata from store', () => {
    expect(component.fileMetadata()).toEqual(mockFileMetadata);
  });

  it('should get loading state from store', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should get write access from store', () => {
    expect(component.hasWriteAccess()).toBe(true);
  });

  it('should not set file metadata when file ID is not available', () => {
    const formValues: PatchFileMetadata = {
      title: 'Updated Title',
      description: 'Updated Description',
      resource_type_general: 'Software',
      language: 'fr',
    };

    expect(() => component.setFileMetadata(formValues)).not.toThrow();
  });

  it('should get language name from language codes', () => {
    expect(component.getLanguageName('en')).toBe('en');
    expect(component.getLanguageName('fr')).toBe('fr');
    expect(component.getLanguageName('unknown')).toBe('unknown');
  });

  it('should open edit dialog when openEditFileMetadataDialog is called', () => {
    component.openEditFileMetadataDialog();

    expect(customDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'files.detail.fileMetadata.edit',
      width: '448px',
      data: mockFileMetadata,
    });
  });

  it('should have hasViewOnly computed property', () => {
    expect(component.hasViewOnly).toBeDefined();
    expect(typeof component.hasViewOnly()).toBe('boolean');
  });

  it('should have fileGuid signal', () => {
    expect(component.fileGuid).toBeDefined();
  });
});
