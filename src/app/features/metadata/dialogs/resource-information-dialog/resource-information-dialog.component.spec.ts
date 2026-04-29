import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { ResourceInformationDialogComponent } from './resource-information-dialog.component';

describe('ResourceInformationDialogComponent', () => {
  let component: ResourceInformationDialogComponent;
  let fixture: ComponentFixture<ResourceInformationDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourceInformationDialogComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig)],
    });

    fixture = TestBed.createComponent(ResourceInformationDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values on init when metadata is provided', () => {
    config.data = {
      customItemMetadata: {
        resourceTypeGeneral: 'Dataset',
        language: 'eng',
      },
    };

    component.ngOnInit();

    expect(component.resourceForm.getRawValue()).toEqual({
      resourceType: 'Dataset',
      resourceLanguage: 'eng',
    });
  });

  it('should keep default empty values on init when metadata is not provided', () => {
    config.data = {};

    component.ngOnInit();

    expect(component.resourceForm.getRawValue()).toEqual({
      resourceType: '',
      resourceLanguage: '',
    });
  });

  it('should close dialog with mapped payload on save when form is valid', () => {
    component.resourceForm.setValue({
      resourceType: 'JournalArticle',
      resourceLanguage: 'deu',
    });

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      resourceTypeGeneral: 'JournalArticle',
      language: 'deu',
    });
  });

  it('should not close dialog on save when form is invalid', () => {
    component.resourceForm.setErrors({ invalid: true });

    component.save();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog without payload on cancel', () => {
    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
