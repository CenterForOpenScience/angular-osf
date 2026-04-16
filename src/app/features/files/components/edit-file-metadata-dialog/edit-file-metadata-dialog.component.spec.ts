import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mocked } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsfFileCustomMetadata } from '@osf/features/files/models';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { EditFileMetadataDialogComponent } from './edit-file-metadata-dialog.component';

describe('EditFileMetadataDialogComponent', () => {
  let component: EditFileMetadataDialogComponent;
  let fixture: ComponentFixture<EditFileMetadataDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let dialogConfig: Mocked<DynamicDialogConfig>;

  const mockFileMetadata: OsfFileCustomMetadata = {
    id: '1',
    title: 'Test File',
    description: 'Test Description',
    resourceTypeGeneral: 'Dataset',
    language: 'en',
  };

  beforeEach(() => {
    const dialogConfigMock = { data: mockFileMetadata };

    TestBed.configureTestingModule({
      imports: [EditFileMetadataDialogComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig, dialogConfigMock)],
    });

    fixture = TestBed.createComponent(EditFileMetadataDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    dialogConfig = TestBed.inject(DynamicDialogConfig) as Mocked<DynamicDialogConfig>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all required form controls', () => {
    expect(component.titleControl).toBeDefined();
    expect(component.descriptionControl).toBeDefined();
    expect(component.resourceTypeControl).toBeDefined();
    expect(component.resourceLanguageControl).toBeDefined();
  });

  it('should return correct form controls', () => {
    expect(component.titleControl).toBe(component.fileMetadataForm.get('title'));
    expect(component.descriptionControl).toBe(component.fileMetadataForm.get('description'));
    expect(component.resourceTypeControl).toBe(component.fileMetadataForm.get('resourceType'));
    expect(component.resourceLanguageControl).toBe(component.fileMetadataForm.get('resourceLanguage'));
  });

  it('should close dialog with form values when setFileMetadata is called with valid form', () => {
    component.setFileMetadata();

    expect(dialogRef.close).toHaveBeenCalledWith({
      title: 'Test File',
      description: 'Test Description',
      resource_type_general: 'Dataset',
      language: 'en',
    });
  });

  it('should always close dialog when setFileMetadata is called (form has no validators)', () => {
    component.titleControl.setValue('');

    component.setFileMetadata();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog without result when cancel is called', () => {
    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should handle null values in metadata', () => {
    dialogConfig.data = {
      title: null,
      description: null,
      resourceTypeGeneral: [],
      language: [],
    };
    fixture = TestBed.createComponent(EditFileMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.titleControl.value).toBeNull();
    expect(component.descriptionControl.value).toBeNull();
    expect(component.resourceTypeControl.value).toBeNull();
    expect(component.resourceLanguageControl.value).toBeNull();
  });

  it('should be valid with default values', () => {
    expect(component.fileMetadataForm.valid).toBe(true);
  });

  it('should handle form updates', () => {
    component.titleControl.setValue('Updated Title');
    component.descriptionControl.setValue('Updated Description');

    expect(component.titleControl.value).toBe('Updated Title');
    expect(component.descriptionControl.value).toBe('Updated Description');
  });
});
