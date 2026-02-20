import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { RegistryResource } from '../../models';
import { RegistrySelectors } from '../../store/registry';
import { RegistryResourcesSelectors } from '../../store/registry-resources';

import { RegistryResourcesComponent } from './registry-resources.component';

import { MOCK_PROJECT_IDENTIFIERS } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

const MOCK_RESOURCE: RegistryResource = {
  id: 'res-1',
  description: 'Test resource',
  finalized: true,
  type: RegistryResourceType.Data,
  pid: '10.123/test',
};

function setup(overrides: BaseSetupOverrides = {}) {
  const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: 'reg-1' });
  if (overrides.hasParent === false) routeBuilder.withNoParent();
  const mockRoute = routeBuilder.build();

  const dialogClose$ = new Subject<unknown>();
  const mockDialogService = CustomDialogServiceMockBuilder.create()
    .withOpen(
      jest.fn().mockReturnValue({
        onClose: dialogClose$.pipe(),
        close: jest.fn(),
      })
    )
    .build();

  const mockConfirmationService = CustomConfirmationServiceMock.simple();
  const mockToastService = ToastServiceMock.simple();

  const defaultSignals = [
    { selector: RegistryResourcesSelectors.getResources, value: [] },
    { selector: RegistryResourcesSelectors.isResourcesLoading, value: false },
    { selector: RegistryResourcesSelectors.getCurrentResource, value: null },
    { selector: RegistrySelectors.getRegistry, value: null },
    { selector: RegistrySelectors.getIdentifiers, value: [MOCK_PROJECT_IDENTIFIERS] },
    { selector: RegistrySelectors.hasWriteAccess, value: true },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [
      RegistryResourcesComponent,
      ...MockComponents(LoadingSpinnerComponent, SubHeaderComponent, IconComponent),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockRoute),
      MockProvider(CustomDialogService, mockDialogService),
      MockProvider(CustomConfirmationService, mockConfirmationService),
      MockProvider(ToastService, mockToastService),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryResourcesComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    fixture,
    component,
    store,
    dialogClose$,
    mockDialogService,
    mockConfirmationService,
    mockToastService,
  };
}

describe('RegistryResourcesComponent', () => {
  it('should create with default values', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.isAddingResource()).toBe(false);
    expect(component.doiDomain).toBe('https://doi.org/');
  });

  it('should dispatch getResources when registryId is available', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ registryId: 'reg-1' }));
  });

  it('should not dispatch getResources when registryId is not available', () => {
    const { store } = setup({ hasParent: false });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should compute addButtonVisible when identifiers exist and canEdit', () => {
    const { component } = setup();

    expect(component.addButtonVisible()).toBe(true);
  });

  it('should compute addButtonVisible as false when no identifiers', () => {
    const { component } = setup({
      selectorOverrides: [{ selector: RegistrySelectors.getIdentifiers, value: [] }],
    });

    expect(component.addButtonVisible()).toBe(false);
  });

  it('should compute addButtonVisible as false when canEdit is false', () => {
    const { component } = setup({
      selectorOverrides: [{ selector: RegistrySelectors.hasWriteAccess, value: false }],
    });

    expect(component.addButtonVisible()).toBe(false);
  });

  it('should add resource and show success toast on dialog confirm', () => {
    const { component, dialogClose$, mockDialogService, mockToastService, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.addResource();

    expect(component.isAddingResource()).toBe(true);
    expect(store.dispatch).toHaveBeenCalled();
    expect(mockDialogService.open).toHaveBeenCalled();

    dialogClose$.next(true);
    dialogClose$.complete();

    expect(mockToastService.showSuccess).toHaveBeenCalledWith('resources.toastMessages.addResourceSuccess');
    expect(component.isAddingResource()).toBe(false);
  });

  it('should reset isAddingResource when dialog is dismissed', () => {
    const { component, dialogClose$ } = setup();

    component.addResource();

    expect(component.isAddingResource()).toBe(true);

    dialogClose$.next(null);
    dialogClose$.complete();

    expect(component.isAddingResource()).toBe(false);
  });

  it('should show error toast when addResource dispatch errors', () => {
    const { component, store, mockToastService } = setup();

    jest.spyOn(store, 'dispatch').mockReturnValue(throwError(() => new Error('fail')));
    component.addResource();

    expect(mockToastService.showError).toHaveBeenCalledWith('resources.toastMessages.addResourceError');
  });

  it('should not add resource when registryId is not available', () => {
    const { component, store, mockDialogService } = setup({ hasParent: false });

    (store.dispatch as jest.Mock).mockClear();
    component.addResource();

    expect(component.isAddingResource()).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockDialogService.open).not.toHaveBeenCalled();
  });

  it('should open edit dialog on updateResource', () => {
    const { component, mockDialogService } = setup();

    component.updateResource(MOCK_RESOURCE);

    expect(mockDialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'resources.edit',
        data: { id: 'reg-1', resource: MOCK_RESOURCE },
      })
    );
  });

  it('should show success toast on updateResource dialog confirm', () => {
    const { component, dialogClose$, mockToastService } = setup();

    component.updateResource(MOCK_RESOURCE);
    dialogClose$.next(true);
    dialogClose$.complete();

    expect(mockToastService.showSuccess).toHaveBeenCalledWith('resources.toastMessages.updatedResourceSuccess');
  });

  it('should show error toast when updateResource dialog errors', () => {
    const errorSubject = new Subject<unknown>();
    const { component, mockDialogService, mockToastService } = setup();

    mockDialogService.open.mockReturnValue({ onClose: errorSubject.pipe() } as any);
    component.updateResource(MOCK_RESOURCE);
    errorSubject.error(new Error('fail'));

    expect(mockToastService.showError).toHaveBeenCalledWith('resources.toastMessages.updateResourceError');
  });

  it('should not update resource when registryId is not available', () => {
    const { component, mockDialogService } = setup({ hasParent: false });

    component.updateResource(MOCK_RESOURCE);

    expect(mockDialogService.open).not.toHaveBeenCalled();
  });

  it('should delete resource with confirmation', () => {
    const { component, mockConfirmationService } = setup();

    component.deleteResource('res-1');

    expect(mockConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'resources.delete',
        messageKey: 'resources.deleteText',
        acceptLabelKey: 'common.buttons.remove',
        onConfirm: expect.any(Function),
      })
    );
  });

  it('should dispatch delete and show toast on confirm', () => {
    const { component, mockConfirmationService, mockToastService, store } = setup();

    mockConfirmationService.confirmDelete.mockImplementation(({ onConfirm }: { onConfirm: () => void }) => onConfirm());

    (store.dispatch as jest.Mock).mockClear();
    component.deleteResource('res-1');

    expect(store.dispatch).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('resources.toastMessages.deletedResourceSuccess');
  });

  it('should not delete resource when registryId is not available', () => {
    const { component, mockConfirmationService } = setup({ hasParent: false });

    component.deleteResource('res-1');

    expect(mockConfirmationService.confirmDelete).not.toHaveBeenCalled();
  });
});
