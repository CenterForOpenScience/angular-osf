import { MockProvider } from 'ng-mocks';

import { of, Subject, throwError } from 'rxjs';

import { DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ForkDialogComponent } from '@osf/shared/components/fork-dialog/fork-dialog.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ForkDialogService } from './fork-dialog.service';

describe('ForkDialogService', () => {
  let service: ForkDialogService;
  let customDialogService: CustomDialogServiceMockType;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;
  let destroyRef: DestroyRef;

  function setup() {
    customDialogService = CustomDialogServiceMock.simple();
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();
    destroyRef = { onDestroy: vi.fn() } as unknown as DestroyRef;

    TestBed.configureTestingModule({
      providers: [
        ForkDialogService,
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
      ],
    });

    service = TestBed.inject(ForkDialogService);
  }

  it('confirmFork should open dialog with project header', () => {
    setup();
    const onClose$ = new Subject<boolean>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));

    service.confirmFork({
      resourceType: CurrentResourceType.Projects,
      destroyRef,
      fork: vi.fn().mockReturnValue(of(undefined)),
    });

    expect(customDialogService.open).toHaveBeenCalledWith(ForkDialogComponent, {
      header: 'project.overview.dialog.fork.headerProject',
      width: '450px',
      data: { resourceType: CurrentResourceType.Projects },
    });
  });

  it('confirmFork should open dialog with registration header', () => {
    setup();
    const onClose$ = new Subject<boolean>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));

    service.confirmFork({
      resourceType: CurrentResourceType.Registrations,
      destroyRef,
      fork: vi.fn().mockReturnValue(of(undefined)),
    });

    expect(customDialogService.open).toHaveBeenCalledWith(ForkDialogComponent, {
      header: 'project.overview.dialog.fork.headerRegistration',
      width: '450px',
      data: { resourceType: CurrentResourceType.Registrations },
    });
  });

  it('confirmFork should not fork when dialog is dismissed', () => {
    setup();
    const onClose$ = new Subject<boolean>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));
    const fork = vi.fn().mockReturnValue(of(undefined));
    const onSuccess = vi.fn();

    service.confirmFork({
      resourceType: CurrentResourceType.Projects,
      destroyRef,
      fork,
      onSuccess,
    });

    onClose$.next(false);

    expect(fork).not.toHaveBeenCalled();
    expect(loaderService.show).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('confirmFork should fork project, show toast, and call onSuccess', () => {
    setup();
    const onClose$ = new Subject<boolean>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));
    const fork = vi.fn().mockReturnValue(of(undefined));
    const onSuccess = vi.fn();

    service.confirmFork({
      resourceType: CurrentResourceType.Projects,
      destroyRef,
      fork,
      onSuccess,
    });

    onClose$.next(true);

    expect(loaderService.show).toHaveBeenCalled();
    expect(fork).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.fork.success');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('confirmFork should show registration success toast', () => {
    setup();
    const onClose$ = new Subject<boolean>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));

    service.confirmFork({
      resourceType: CurrentResourceType.Registrations,
      destroyRef,
      fork: vi.fn().mockReturnValue(of(undefined)),
    });

    onClose$.next(true);

    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.fork.successRegistration');
  });

  it('confirmFork should hide loader and skip success handlers when fork fails', () => {
    setup();
    const onClose$ = new Subject<boolean>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));
    const onSuccess = vi.fn();

    service.confirmFork({
      resourceType: CurrentResourceType.Projects,
      destroyRef,
      fork: vi.fn().mockReturnValue(throwError(() => new Error('fork failed'))),
      onSuccess,
    });

    onClose$.next(true);

    expect(loaderService.show).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
