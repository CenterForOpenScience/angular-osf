import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';

import { RegistryResource } from '../../models';
import { RegistryResourcesSelectors } from '../../store/registry-resources';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

import { AddResourceDialogComponent } from './add-resource-dialog.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

const MOCK_RESOURCE: RegistryResource = {
  id: 'res-1',
  description: 'Test',
  finalized: false,
  type: RegistryResourceType.Data,
  pid: '10.1234/test',
};

interface SetupOverrides {
  registryId?: string;
  selectorOverrides?: SignalOverride[];
}

function setup(overrides: SetupOverrides = {}) {
  const mockDialogConfig = { data: { id: overrides.registryId ?? 'registry-123' } };

  const defaultSignals = [
    { selector: RegistryResourcesSelectors.getCurrentResource, value: null },
    { selector: RegistryResourcesSelectors.isCurrentResourceLoading, value: false },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [
      AddResourceDialogComponent,
      ...MockComponents(LoadingSpinnerComponent, ResourceFormComponent, IconComponent),
    ],
    providers: [
      provideOSFCore(),
      provideDynamicDialogRefMock(),
      MockProvider(DynamicDialogConfig, mockDialogConfig),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const dialogRef = TestBed.inject(DynamicDialogRef);
  const fixture = TestBed.createComponent(AddResourceDialogComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, store, dialogRef };
}

describe('AddResourceDialogComponent', () => {
  it('should create with default values', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.doiDomain).toBe('https://doi.org/');
    expect(component.isResourceConfirming()).toBe(false);
    expect(component.isPreviewMode()).toBe(false);
  });

  it('should initialize form with empty values', () => {
    const { component } = setup();

    expect(component.form.get('pid')?.value).toBe('');
    expect(component.form.get('resourceType')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
  });

  it('should validate pid with DOI validator', () => {
    const { component } = setup();
    const pidControl = component.form.get('pid');

    pidControl?.setValue('invalid-doi');
    pidControl?.updateValueAndValidity();

    const hasDoiError = pidControl?.hasError('doi') || pidControl?.hasError('invalidDoi');
    expect(hasDoiError).toBe(true);
  });

  it('should accept valid DOI format', () => {
    const { component } = setup();
    const pidControl = component.form.get('pid');

    pidControl?.setValue('10.1234/valid.doi');

    expect(pidControl?.hasError('doi')).toBe(false);
  });

  it('should not preview resource when form is invalid', () => {
    const { component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.previewResource();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.isPreviewMode()).toBe(false);
  });

  it('should not preview resource when currentResource is null', () => {
    const { component, store } = setup();

    component.form.patchValue({ pid: '10.1234/test', resourceType: 'data' });
    (store.dispatch as jest.Mock).mockClear();
    component.previewResource();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.isPreviewMode()).toBe(false);
  });

  it('should preview resource and set preview mode on success', () => {
    const { component, store } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getCurrentResource, value: MOCK_RESOURCE }],
    });

    component.form.patchValue({ pid: '10.1234/test', resourceType: 'data', description: 'desc' });
    (store.dispatch as jest.Mock).mockClear();
    component.previewResource();

    expect(store.dispatch).toHaveBeenCalled();
    expect(component.isPreviewMode()).toBe(true);
  });

  it('should set isPreviewMode to false when backToEdit is called', () => {
    const { component } = setup();

    component.isPreviewMode.set(true);
    component.backToEdit();

    expect(component.isPreviewMode()).toBe(false);
  });

  it('should not add resource when currentResource is null', () => {
    const { component, store, dialogRef } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.onAddResource();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should confirm add resource and close dialog on success', () => {
    const { component, store, dialogRef } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getCurrentResource, value: MOCK_RESOURCE }],
    });

    (store.dispatch as jest.Mock).mockClear();
    component.onAddResource();

    expect(component.isResourceConfirming()).toBe(false);
    expect(store.dispatch).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog without deleting when currentResource is null', () => {
    const { component, store, dialogRef } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should delete resource and close dialog when currentResource exists', () => {
    const { component, store, dialogRef } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getCurrentResource, value: MOCK_RESOURCE }],
    });

    (store.dispatch as jest.Mock).mockClear();
    component.closeDialog();

    expect(store.dispatch).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should compute doiLink from currentResource pid', () => {
    const { component } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getCurrentResource, value: MOCK_RESOURCE }],
    });

    expect(component.doiLink()).toBe('https://doi.org/10.1234/test');
  });

  it('should return empty string for resourceTypeTranslationKey when currentResource is null', () => {
    const { component } = setup();

    expect(component.resourceTypeTranslationKey()).toBe('');
  });

  it('should return translation key for resourceTypeTranslationKey when resource type matches', () => {
    const { component } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getCurrentResource, value: MOCK_RESOURCE }],
    });

    expect(component.resourceTypeTranslationKey()).toBe('resources.typeOptions.data');
  });

  it('should return empty string for resourceTypeTranslationKey when type is unknown', () => {
    const unknownResource = { ...MOCK_RESOURCE, type: 'unknown_type' as RegistryResourceType };
    const { component } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getCurrentResource, value: unknownResource }],
    });

    expect(component.resourceTypeTranslationKey()).toBe('');
  });
});
