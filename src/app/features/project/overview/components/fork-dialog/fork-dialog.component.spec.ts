import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { EMPTY } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ForkResource, ProjectOverviewSelectors } from '../../store';

import { ForkDialogComponent } from './fork-dialog.component';

interface SetupOverrides extends BaseSetupOverrides {
  resourceId?: string;
  resourceType?: ResourceType | null;
}

describe('ForkDialogComponent', () => {
  let component: ForkDialogComponent;
  let fixture: ComponentFixture<ForkDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;

  const defaultSignals: SignalOverride[] = [
    { selector: ProjectOverviewSelectors.getForkProjectSubmitting, value: false },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ForkDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, {
          data: {
            resourceId: overrides.resourceId ?? 'project-1',
            resourceType: overrides.resourceType === undefined ? ResourceType.Project : overrides.resourceType,
          },
        }),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ForkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should not dispatch fork action when resource id is missing', () => {
    setup({ resourceId: '' });
    (store.dispatch as Mock).mockClear();

    component.handleForkConfirm();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ForkResource));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should not dispatch fork action when resource type is missing', () => {
    setup({ resourceType: null });
    (store.dispatch as Mock).mockClear();

    component.handleForkConfirm();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ForkResource));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should dispatch fork action and close dialog with success toast', () => {
    setup({ resourceId: 'project-1', resourceType: ResourceType.Project });
    (store.dispatch as Mock).mockClear();

    component.handleForkConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new ForkResource('project-1', ResourceType.Project));
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.fork.success');
  });

  it('should still close dialog and show toast when fork action errors', () => {
    setup({ resourceId: 'project-1', resourceType: ResourceType.Project });
    (store.dispatch as Mock).mockClear();
    (store.dispatch as Mock).mockReturnValueOnce(EMPTY);

    component.handleForkConfirm();
    expect(store.dispatch).toHaveBeenCalledWith(new ForkResource('project-1', ResourceType.Project));
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.fork.success');
  });
});
