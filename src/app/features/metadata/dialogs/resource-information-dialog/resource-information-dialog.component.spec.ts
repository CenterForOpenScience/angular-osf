import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { ResourceInformationDialogComponent } from './resource-information-dialog.component';

describe('ResourceInformationDialogComponent', () => {
  let component: ResourceInformationDialogComponent;
  let fixture: ComponentFixture<ResourceInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceInformationDialogComponent],
      providers: [TranslateServiceMock, MockProvider(DynamicDialogRef), MockProvider(DynamicDialogConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceInformationDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have resource type options', () => {
    expect(component.resourceTypeOptions).toBeDefined();
    expect(component.resourceTypeOptions.length).toBeGreaterThan(0);
  });

  it('should have language options', () => {
    expect(component.languageOptions).toBeDefined();
    expect(component.languageOptions.length).toBeGreaterThan(0);
  });

  it('should not save when form is invalid', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.resourceForm.patchValue({
      resourceType: 'dataset',
      resourceLanguage: 'en',
    });

    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      resourceTypeGeneral: 'dataset',
      language: 'en',
    });
  });

  it('should not save when resource type is missing', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.resourceForm.patchValue({
      resourceType: '',
      resourceLanguage: 'en',
    });

    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      resourceTypeGeneral: '',
      language: 'en',
    });
  });

  it('should cancel dialog', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.cancel();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const resourceTypeControl = component.resourceForm.get('resourceType');

    expect(resourceTypeControl?.hasError('required')).toBe(false);

    resourceTypeControl?.setValue('dataset');

    expect(resourceTypeControl?.hasError('required')).toBe(false);
  });

  it('should handle form validation state', () => {
    expect(component.resourceForm.valid).toBe(true);

    component.resourceForm.patchValue({
      resourceType: 'dataset',
      resourceLanguage: 'en',
    });

    expect(component.resourceForm.valid).toBe(true);
  });
});
