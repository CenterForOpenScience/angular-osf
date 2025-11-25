import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';

import { ForkResource, ProjectOverviewSelectors } from '../../store';

import { ForkDialogComponent } from './fork-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ForkDialogComponent', () => {
  let component: ForkDialogComponent;
  let fixture: ComponentFixture<ForkDialogComponent>;
  let store: jest.Mocked<Store>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: jest.Mocked<DynamicDialogConfig>;
  let toastService: jest.Mocked<ToastService>;

  const mockResourceId = 'test-resource-id';
  const mockResourceType = ResourceType.Project;

  beforeEach(async () => {
    dialogConfig = {
      data: {
        resourceId: mockResourceId,
        resourceType: mockResourceType,
      },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [ForkDialogComponent, OSFTestingModule],
      providers: [
        DynamicDialogRefMock,
        ToastServiceMock,
        MockProvider(DynamicDialogConfig, dialogConfig),
        provideMockStore({
          signals: [{ selector: ProjectOverviewSelectors.getForkProjectSubmitting, value: false }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(ForkDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch ForkResource action with correct parameters', () => {
    component.handleForkConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ForkResource));
    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof ForkResource);
    expect(call).toBeDefined();
    const action = call[0] as ForkResource;
    expect(action.resourceId).toBe(mockResourceId);
    expect(action.resourceType).toBe(mockResourceType);
  });

  it('should close dialog with success result', fakeAsync(() => {
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.handleForkConfirm();
    tick();

    expect(closeSpy).toHaveBeenCalledWith({ success: true });
  }));

  it('should show success toast message', fakeAsync(() => {
    component.handleForkConfirm();
    tick();

    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.fork.success');
  }));

  it('should not dispatch action when resourceId is missing', () => {
    jest.clearAllMocks();
    component.config.data = {
      resourceType: mockResourceType,
    };

    component.handleForkConfirm();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should not dispatch action when resourceType is missing', () => {
    jest.clearAllMocks();
    component.config.data = {
      resourceId: mockResourceId,
    };

    component.handleForkConfirm();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should not dispatch action when both resourceId and resourceType are missing', () => {
    jest.clearAllMocks();
    component.config.data = {};

    component.handleForkConfirm();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should handle ForkResource action for Registration resource type', () => {
    jest.clearAllMocks();
    component.config.data = {
      resourceId: mockResourceId,
      resourceType: ResourceType.Registration,
    };

    component.handleForkConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ForkResource));
    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof ForkResource);
    expect(call).toBeDefined();
    const action = call[0] as ForkResource;
    expect(action.resourceId).toBe(mockResourceId);
    expect(action.resourceType).toBe(ResourceType.Registration);
  });
});
