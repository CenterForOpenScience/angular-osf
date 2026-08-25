import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject, throwError } from 'rxjs';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_PROJECT_IDENTIFIERS } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { RegistryResource } from '../../models';
import { RegistrySelectors } from '../../store/registry';
import { RegistryResourcesSelectors } from '../../store/registry-resources';

import { RegistryResourcesComponent } from './registry-resources.component';

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
      vi.fn().mockReturnValue({
        onClose: dialogClose$.pipe(),
        close: vi.fn(),
      })
    )
    .build();

  const mockConfirmationService = CustomConfirmationServiceMock.simple();
  const mockToastService = ToastServiceMock.simple();

  const defaultSignals = [
    { selector: RegistryResourcesSelectors.getResources, value: [] },
    { selector: RegistryResourcesSelectors.getResourcesTotalCount, value: 0 },
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
      ...MockComponents(Button, LoadingSpinnerComponent, SubHeaderComponent, IconComponent, CustomPaginatorComponent),
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
  it('should initialize defaults and load the first page', () => {
    const { component, store, fixture } = setup();

    expect(component.isAddingResource()).toBe(false);
    expect(component.first()).toBe(0);
    expect(component.rows()).toBe(DEFAULT_TABLE_PARAMS.rows);
    expect(component.addButtonVisible()).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ registryId: 'reg-1', page: 1 }));
    expect(fixture.nativeElement.querySelector('osf-custom-paginator')).toBeFalsy();
  });

  it('should skip resource actions when registryId is missing', () => {
    const { component, store, mockDialogService, mockConfirmationService } = setup({ hasParent: false });

    (store.dispatch as Mock).mockClear();
    component.addResource();
    component.updateResource(MOCK_RESOURCE);
    component.deleteResource('res-1');
    component.onPageChange({ page: 1, first: 10, rows: 10 });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockDialogService.open).not.toHaveBeenCalled();
    expect(mockConfirmationService.confirmDelete).not.toHaveBeenCalled();
    expect(component.isAddingResource()).toBe(false);
    expect(component.first()).toBe(10);
  });

  it('should hide add button when identifiers or write access are missing', () => {
    const { component: withoutIdentifiers } = setup({
      selectorOverrides: [{ selector: RegistrySelectors.getIdentifiers, value: [] }],
    });
    const { component: withoutWriteAccess } = setup({
      selectorOverrides: [{ selector: RegistrySelectors.hasWriteAccess, value: false }],
    });

    expect(withoutIdentifiers.addButtonVisible()).toBe(false);
    expect(withoutWriteAccess.addButtonVisible()).toBe(false);
  });

  it('should add a resource, reset pagination, and show a success toast', () => {
    const { component, dialogClose$, mockDialogService, mockToastService, store } = setup();

    (store.dispatch as Mock).mockClear();
    component.first.set(20);
    component.addResource();
    dialogClose$.next(true);
    dialogClose$.complete();

    expect(mockDialogService.open).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('resources.toastMessages.addResourceSuccess');
    expect(component.isAddingResource()).toBe(false);
    expect(component.first()).toBe(0);
  });

  it('should reset isAddingResource when the add dialog is dismissed', () => {
    const { component, dialogClose$ } = setup();

    component.addResource();
    dialogClose$.next(null);
    dialogClose$.complete();

    expect(component.isAddingResource()).toBe(false);
  });

  it('should show an error toast when addResource fails', () => {
    const { component, store, mockToastService } = setup();

    vi.spyOn(store, 'dispatch').mockReturnValue(throwError(() => new Error('fail')));
    component.addResource();

    expect(mockToastService.showError).toHaveBeenCalledWith('resources.toastMessages.addResourceError');
  });

  it('should update a resource and show a success toast', () => {
    const { component, dialogClose$, mockDialogService, mockToastService } = setup();

    component.updateResource(MOCK_RESOURCE);
    dialogClose$.next(true);
    dialogClose$.complete();

    expect(mockDialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'resources.edit',
        data: { id: 'reg-1', resource: MOCK_RESOURCE },
      })
    );
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('resources.toastMessages.updatedResourceSuccess');
  });

  it('should show an error toast when updateResource fails', () => {
    const errorSubject = new Subject<unknown>();
    const { component, mockDialogService, mockToastService } = setup();

    mockDialogService.open.mockReturnValue({
      onClose: errorSubject.pipe(),
      close: vi.fn(),
    } as unknown as DynamicDialogRef);
    component.updateResource(MOCK_RESOURCE);
    errorSubject.error(new Error('fail'));

    expect(mockToastService.showError).toHaveBeenCalledWith('resources.toastMessages.updateResourceError');
  });

  it('should delete a resource, reset pagination, and show a success toast', () => {
    const { component, mockConfirmationService, mockToastService, store } = setup();

    mockConfirmationService.confirmDelete.mockImplementation(({ onConfirm }: { onConfirm: () => void }) => onConfirm());
    (store.dispatch as Mock).mockClear();
    component.first.set(20);
    component.deleteResource('res-1');

    expect(mockConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'resources.delete',
        messageKey: 'resources.deleteText',
        acceptLabelKey: 'common.buttons.remove',
      })
    );
    expect(store.dispatch).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('resources.toastMessages.deletedResourceSuccess');
    expect(component.first()).toBe(0);
  });

  it('should resolve resource type labels', () => {
    const { component } = setup();

    expect(component.getResourceTypeTranslationKey(RegistryResourceType.Data)).toBe('resourceCard.resources.data');
    expect(component.getResourceTypeTranslationKey(RegistryResourceType.Code)).toBe(
      'resourceCard.resources.analyticCode'
    );
    expect(component.getResourceTypeTranslationKey('unknown')).toBe('');
  });

  it('should load the selected page and keep current rows when rows are omitted', () => {
    const { component, store } = setup();

    (store.dispatch as Mock).mockClear();
    component.rows.set(25);
    component.onPageChange({ page: 1, first: 25, rows: undefined });

    expect(component.first()).toBe(25);
    expect(component.rows()).toBe(25);
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ registryId: 'reg-1', page: 2 }));
  });

  it('should not load a page when the paginator page is undefined', () => {
    const { component, store } = setup();

    (store.dispatch as Mock).mockClear();
    component.onPageChange({ page: undefined, first: 0, rows: 10 });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should render the paginator when total count exceeds page size', () => {
    const { fixture } = setup({
      selectorOverrides: [{ selector: RegistryResourcesSelectors.getResourcesTotalCount, value: 25 }],
    });

    expect(fixture.nativeElement.querySelector('osf-custom-paginator')).toBeTruthy();
  });
});
