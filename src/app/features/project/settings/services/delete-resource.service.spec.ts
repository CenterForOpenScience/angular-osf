import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { of, Subject, throwError } from 'rxjs';

import { Mock } from 'vitest';

import { DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors, GetResourceWithChildren } from '@osf/shared/stores/current-resource';

import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { DeleteResourceDialogComponent } from '../components/delete-resource-dialog/delete-resource-dialog.component';
import { DeleteProject } from '../store/settings.actions';

import { DeleteResourceService } from './delete-resource.service';

describe('DeleteResourceService', () => {
  let service: DeleteResourceService;
  let store: Store;
  let customDialogService: CustomDialogServiceMockType;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;
  let destroyRef: DestroyRef;
  let onClose$: Subject<boolean>;
  let onSuccess: Mock<() => void>;

  const resources: NodeShortInfoModel[] = [
    {
      id: 'resource-1',
      title: 'Resource 1',
      isPublic: true,
      permissions: [UserPermissions.Admin],
    },
  ];

  const baseOptions = {
    rootParentId: 'root-1',
    resourceId: 'resource-1',
  };

  function setup() {
    customDialogService = CustomDialogServiceMock.simple();
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();
    destroyRef = { onDestroy: vi.fn() } as unknown as DestroyRef;
    onClose$ = new Subject<boolean>();
    onSuccess = vi.fn<() => void>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));

    TestBed.configureTestingModule({
      providers: [
        DeleteResourceService,
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [{ selector: CurrentResourceSelectors.getResourceWithChildren, value: resources }],
        }),
      ],
    });

    service = TestBed.inject(DeleteResourceService);
    store = TestBed.inject(Store);
  }

  it('should create', () => {
    setup();
    expect(service).toBeTruthy();
  });

  it('deleteComponent should load children, open component dialog, delete, toast, and call onSuccess', () => {
    setup();

    service.deleteComponent({ ...baseOptions, destroyRef, onSuccess });

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetResourceWithChildren('root-1', 'resource-1', ResourceType.Project)
    );
    expect(loaderService.show).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(customDialogService.open).toHaveBeenCalledWith(DeleteResourceDialogComponent, {
      header: 'project.overview.dialog.deleteComponent.header',
      width: '500px',
      data: {
        listMessageKey: 'project.overview.dialog.deleteComponent.listMessage',
        warningMessageKey: 'project.overview.dialog.deleteComponent.warningMessage',
        confirmationKey: 'project.overview.dialog.deleteComponent.confirmation',
        noPermissionsMessageKey: 'project.overview.dialog.deleteComponent.noPermissionsMessage',
        singleMessageKey: 'project.overview.dialog.deleteComponent.message',
      },
    });

    (store.dispatch as Mock).mockClear();
    loaderService.show.mockClear();
    loaderService.hide.mockClear();

    onClose$.next(true);

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteProject(resources));
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.deleteComponent.success');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('deleteProject should open project dialog and show project success toast', () => {
    setup();

    service.deleteProject({ ...baseOptions, destroyRef, onSuccess });

    expect(customDialogService.open).toHaveBeenCalledWith(DeleteResourceDialogComponent, {
      header: 'project.deleteProject.dialog.deleteProject',
      width: '500px',
      data: {
        listMessageKey: 'project.deleteProject.dialog.listMessage',
        warningMessageKey: 'project.deleteProject.dialog.warningMessage',
        confirmationKey: 'project.deleteProject.dialog.confirmation',
        noPermissionsMessageKey: 'project.deleteProject.dialog.noPermissionsMessage',
      },
    });

    onClose$.next(true);

    expect(toastService.showSuccess).toHaveBeenCalledWith('project.deleteProject.success');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should not delete when dialog is dismissed', () => {
    setup();

    service.deleteProject({ ...baseOptions, destroyRef, onSuccess });
    (store.dispatch as Mock).mockClear();

    onClose$.next(false);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should hide loader and skip success handlers when delete fails', () => {
    setup();
    (store.dispatch as Mock).mockImplementation((action: unknown) => {
      if (action instanceof DeleteProject) {
        return throwError(() => new Error('delete failed'));
      }
      return of(true);
    });

    service.deleteProject({ ...baseOptions, destroyRef, onSuccess });
    loaderService.hide.mockClear();

    onClose$.next(true);

    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should skip dialog when loading children fails', () => {
    setup();
    (store.dispatch as Mock).mockReturnValue(throwError(() => new Error('load failed')));

    service.deleteProject({ ...baseOptions, destroyRef, onSuccess });

    expect(customDialogService.open).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
