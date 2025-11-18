import { Store } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';
import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';

import { RegistryResourcesSelectors } from '../../store/registry-resources';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

import { AddResourceDialogComponent } from './add-resource-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddResourceDialogComponent', () => {
  let component: AddResourceDialogComponent;
  let fixture: ComponentFixture<AddResourceDialogComponent>;
  let store: Store;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  const mockRegistryId = 'registry-123';

  beforeEach(async () => {
    mockDialogConfig = {
      data: {
        id: mockRegistryId,
      },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [
        AddResourceDialogComponent,
        OSFTestingModule,
        MockComponent(LoadingSpinnerComponent),
        MockComponent(ResourceFormComponent),
        MockComponent(IconComponent),
      ],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        MockProvider(TranslateService, {
          instant: jest.fn((key: string) => key),
        }),
        provideMockStore({
          signals: [
            { selector: RegistryResourcesSelectors.getCurrentResource, value: signal(null) },
            { selector: RegistryResourcesSelectors.isCurrentResourceLoading, value: signal(false) },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddResourceDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.doiDomain).toBe('https://doi.org/');
    expect(component.inputLimits).toBeDefined();
    expect(component.isResourceConfirming()).toBe(false);
    expect(component.isPreviewMode()).toBe(false);
    expect(component.resourceOptions()).toBeDefined();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('pid')?.value).toBe('');
    expect(component.form.get('resourceType')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
  });

  it('should validate pid with DOI validator', () => {
    const pidControl = component.form.get('pid');
    pidControl?.setValue('invalid-doi');
    pidControl?.updateValueAndValidity();

    const hasDoiError = pidControl?.hasError('doi') || pidControl?.hasError('invalidDoi');
    expect(hasDoiError).toBe(true);
  });

  it('should accept valid DOI format', () => {
    const pidControl = component.form.get('pid');
    pidControl?.setValue('10.1234/valid.doi');

    expect(pidControl?.hasError('doi')).toBe(false);
  });

  it('should not preview resource when form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.get('pid')?.setValue('');

    component.previewResource();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.isPreviewMode()).toBe(false);
  });

  it('should throw error when previewing resource without current resource', () => {
    component.form.patchValue({
      pid: '10.1234/test',
      resourceType: 'dataset',
    });

    expect(() => component.previewResource()).toThrow();
  });

  it('should set isPreviewMode to false when backToEdit is called', () => {
    component.isPreviewMode.set(true);

    component.backToEdit();

    expect(component.isPreviewMode()).toBe(false);
  });

  it('should throw error when adding resource without current resource', () => {
    expect(() => component.onAddResource()).toThrow();
  });

  it('should close dialog without deleting when closeDialog is called without current resource', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should compute doiLink as undefined when current resource does not exist', () => {
    expect(component.doiLink()).toBe('https://doi.org/undefined');
  });
});
