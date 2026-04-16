import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProject, SettingsSelectors } from '@osf/features/project/settings/store';
import { RegistrySelectors } from '@osf/features/registry/store/registry';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ProjectOverviewModel } from '../../models';
import { GetComponents, ProjectOverviewSelectors } from '../../store';

import { DeleteComponentDialogComponent } from './delete-component-dialog.component';

interface SetupOverrides extends BaseSetupOverrides {
  resourceType?: ResourceType;
  isForksContext?: boolean;
}

describe('DeleteComponentDialogComponent', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;

  const mockProject: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-1',
  };

  const adminComponents: NodeShortInfoModel[] = [
    {
      id: 'c1',
      title: 'Component 1',
      isPublic: true,
      permissions: [UserPermissions.Admin],
    },
    {
      id: 'c2',
      title: 'Component 2',
      isPublic: true,
      permissions: [UserPermissions.Admin, UserPermissions.Write],
    },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: ProjectOverviewSelectors.getProject, value: mockProject },
    { selector: RegistrySelectors.getRegistry, value: null },
    { selector: SettingsSelectors.isSettingsSubmitting, value: false },
    { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
    { selector: CurrentResourceSelectors.getResourceWithChildren, value: adminComponents },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, {
          data: {
            resourceType: overrides.resourceType ?? ResourceType.Project,
            isForksContext: overrides.isForksContext ?? false,
          },
        }),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should compute current resource from project when resource type is project', () => {
    setup({ resourceType: ResourceType.Project });

    expect(component.currentResource()?.id).toBe('project-1');
  });

  it('should return false for hasAdminAccessForAllComponents when components are empty', () => {
    setup({
      selectorOverrides: [{ selector: CurrentResourceSelectors.getResourceWithChildren, value: [] }],
    });

    expect(component.hasAdminAccessForAllComponents()).toBe(false);
  });

  it('should return true for hasAdminAccessForAllComponents when all components have admin access', () => {
    setup();

    expect(component.hasAdminAccessForAllComponents()).toBe(true);
  });

  it('should return true for hasSubComponents when there are multiple components', () => {
    setup();

    expect(component.hasSubComponents()).toBe(true);
  });

  it('should return false for hasSubComponents when there is one component', () => {
    setup({
      selectorOverrides: [{ selector: CurrentResourceSelectors.getResourceWithChildren, value: [adminComponents[0]] }],
    });

    expect(component.hasSubComponents()).toBe(false);
  });

  it('should update userInput on input change and validate exact match', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    setup();

    component.onInputChange(component.selectedScientist());

    expect(component.userInput()).toBe(component.selectedScientist());
    expect(component.isInputValid()).toBe(true);
    vi.restoreAllMocks();
  });

  it('should not dispatch delete action when there are no components', () => {
    setup({
      selectorOverrides: [{ selector: CurrentResourceSelectors.getResourceWithChildren, value: [] }],
    });
    (store.dispatch as Mock).mockClear();

    component.handleDeleteComponent();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeleteProject));
  });

  it('should delete components, refresh list, close dialog and show success when not forks context', () => {
    setup({ isForksContext: false });
    (store.dispatch as Mock).mockClear();

    component.handleDeleteComponent();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteProject(adminComponents));
    expect(store.dispatch).toHaveBeenCalledWith(new GetComponents('project-1'));
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.deleteComponent.success');
  });

  it('should skip components refresh after delete in forks context', () => {
    setup({ isForksContext: true });
    (store.dispatch as Mock).mockClear();

    component.handleDeleteComponent();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteProject(adminComponents));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetComponents));
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
  });
});
