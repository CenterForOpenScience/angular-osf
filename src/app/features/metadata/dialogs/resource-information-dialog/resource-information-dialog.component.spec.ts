import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STUDY_REGISTRATION_RESOURCE_TYPE } from '@osf/shared/constants/resource-type-general-options.const';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { ResourceInformationDialogComponent } from './resource-information-dialog.component';

describe('ResourceInformationDialogComponent', () => {
  let component: ResourceInformationDialogComponent;
  let fixture: ComponentFixture<ResourceInformationDialogComponent>;
  let dialogRef: DynamicDialogRef;

  interface SetupOverrides {
    customItemMetadata?: {
      resourceTypeGeneral?: string;
      language?: string;
    };
    languageOnly?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [ResourceInformationDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, {
          data: {
            customItemMetadata: overrides.customItemMetadata,
            languageOnly: overrides.languageOnly ?? false,
          },
        }),
      ],
    });

    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ResourceInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should patch form values on init when metadata is provided', () => {
    setup({
      customItemMetadata: {
        resourceTypeGeneral: 'Dataset',
        language: 'eng',
      },
    });

    expect(component.resourceForm.getRawValue()).toEqual({
      resourceType: 'Dataset',
      resourceLanguage: 'eng',
    });
  });

  it('should keep default empty values on init when metadata is not provided', () => {
    setup();

    expect(component.resourceForm.getRawValue()).toEqual({
      resourceType: '',
      resourceLanguage: '',
    });
  });

  it('should default resource type to StudyRegistration when languageOnly', () => {
    setup({
      languageOnly: true,
      customItemMetadata: {
        resourceTypeGeneral: 'Dataset',
        language: 'eng',
      },
    });

    expect(component.languageOnly).toBe(true);
    expect(component.resourceForm.getRawValue()).toEqual({
      resourceType: STUDY_REGISTRATION_RESOURCE_TYPE,
      resourceLanguage: 'eng',
    });
  });

  it('should close dialog with mapped payload on save when form is valid', () => {
    setup();

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

  it('should close dialog with StudyRegistration resource type when languageOnly', () => {
    setup({ languageOnly: true });

    component.resourceForm.setValue({
      resourceType: 'Dataset',
      resourceLanguage: 'deu',
    });

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      resourceTypeGeneral: STUDY_REGISTRATION_RESOURCE_TYPE,
      language: 'deu',
    });
  });

  it('should close dialog without payload on cancel', () => {
    setup();

    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
