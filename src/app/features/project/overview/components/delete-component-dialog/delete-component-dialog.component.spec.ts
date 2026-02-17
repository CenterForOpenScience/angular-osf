import { Store } from '@ngxs/store';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProject, SettingsSelectors } from '@osf/features/project/settings/store';
import { RegistrySelectors } from '@osf/features/registry/store/registry';
import { ScientistsNames } from '@osf/shared/constants/scientists.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { GetComponents, ProjectOverviewSelectors } from '../../store';

import { DeleteComponentDialogComponent } from './delete-component-dialog.component';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const mockComponentsWithAdmin = [
  { id: 'comp-1', title: 'Component 1', isPublic: true, permissions: [UserPermissions.Admin] },
  { id: 'comp-2', title: 'Component 2', isPublic: false, permissions: [UserPermissions.Admin] },
];

const mockComponentsWithoutAdmin = [
  { id: 'comp-1', title: 'Component 1', isPublic: true, permissions: [UserPermissions.Read] },
];

describe('DeleteComponentDialogComponent', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;
  let store: Store;
  let dialogConfig: DynamicDialogConfig;

  const mockProject = { ...MOCK_NODE_WITH_ADMIN, id: 'proj-1' };

  beforeEach(async () => {
    dialogConfig = { data: { resourceType: ResourceType.Project } };

    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: mockComponentsWithAdmin },
          ],
        }),
        { provide: DynamicDialogConfig, useValue: dialogConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockReturnValue(of(void 0));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return store values from selectors', () => {
    expect(component.project()).toEqual(mockProject);
    expect(component.registration()).toBeNull();
    expect(component.isSubmitting()).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(component.components()).toEqual(mockComponentsWithAdmin);
  });

  it('should have selectedScientist as one of ScientistsNames', () => {
    expect(ScientistsNames).toContain(component.selectedScientist());
  });

  it('should compute currentResource as project when resourceType is Project', () => {
    expect(component.currentResource()).toEqual(mockProject);
  });

  it('should compute hasAdminAccessForAllComponents true when all components have Admin', () => {
    expect(component.hasAdminAccessForAllComponents()).toBe(true);
  });

  it('should compute hasSubComponents true when more than one component', () => {
    expect(component.hasSubComponents()).toBe(true);
  });

  it('should return isInputValid true when userInput matches selectedScientist', () => {
    const scientist = component.selectedScientist();
    component.onInputChange(scientist);
    expect(component.isInputValid()).toBe(true);
  });

  it('should return isInputValid false when userInput does not match', () => {
    component.onInputChange('wrong');
    expect(component.isInputValid()).toBe(false);
  });

  it('should set userInput on onInputChange', () => {
    component.onInputChange('test');
    expect(component.userInput()).toBe('test');
  });

  it('should dispatch DeleteProject with components and on success close, getComponents, showSuccess', () => {
    const scientist = component.selectedScientist();
    component.onInputChange(scientist);
    (store.dispatch as jest.Mock).mockClear();

    component.handleDeleteComponent();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(DeleteProject));
    const deleteCall = (store.dispatch as jest.Mock).mock.calls.find((c) => c[0] instanceof DeleteProject);
    expect(deleteCall[0].projects).toEqual(mockComponentsWithAdmin);
    expect(component.dialogRef.close).toHaveBeenCalledWith({ success: true });
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetComponents));
    expect(TestBed.inject(ToastService).showSuccess).toHaveBeenCalledWith(
      'project.overview.dialog.toast.deleteComponent.success'
    );
  });
});

describe('DeleteComponentDialogComponent when not all components have Admin', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: { ...MOCK_NODE_WITH_ADMIN, id: 'proj-1' } },
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: mockComponentsWithoutAdmin },
          ],
        }),
        { provide: DynamicDialogConfig, useValue: { data: { resourceType: ResourceType.Project } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute hasAdminAccessForAllComponents false', () => {
    expect(component.hasAdminAccessForAllComponents()).toBe(false);
  });
});

describe('DeleteComponentDialogComponent when single component', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;

  const singleComponent = [
    { id: 'comp-1', title: 'Component 1', isPublic: true, permissions: [UserPermissions.Admin] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: { ...MOCK_NODE_WITH_ADMIN, id: 'proj-1' } },
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: singleComponent },
          ],
        }),
        { provide: DynamicDialogConfig, useValue: { data: { resourceType: ResourceType.Project } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute hasSubComponents false', () => {
    expect(component.hasSubComponents()).toBe(false);
  });
});

describe('DeleteComponentDialogComponent when no components', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: { ...MOCK_NODE_WITH_ADMIN, id: 'proj-1' } },
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
          ],
        }),
        { provide: DynamicDialogConfig, useValue: { data: { resourceType: ResourceType.Project } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockClear();
    fixture.detectChanges();
  });

  it('should not dispatch when handleDeleteComponent', () => {
    component.handleDeleteComponent();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

describe('DeleteComponentDialogComponent when resourceType is Registration', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;

  const mockRegistration = { ...MOCK_NODE_WITH_ADMIN, id: 'reg-1' };
  const mockComponentsWithAdmin = [
    { id: 'comp-1', title: 'Component 1', isPublic: true, permissions: [UserPermissions.Admin] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: null },
            { selector: RegistrySelectors.getRegistry, value: mockRegistration },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: mockComponentsWithAdmin },
          ],
        }),
        { provide: DynamicDialogConfig, useValue: { data: { resourceType: ResourceType.Registration } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute currentResource as registration', () => {
    expect(component.currentResource()).toEqual(mockRegistration);
  });
});

describe('DeleteComponentDialogComponent isForksContext', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;
  let store: Store;

  const mockProject = { ...MOCK_NODE_WITH_ADMIN, id: 'proj-1' };
  const mockComponentsWithAdmin = [
    { id: 'comp-1', title: 'Component 1', isPublic: true, permissions: [UserPermissions.Admin] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: SettingsSelectors.isSettingsSubmitting, value: false },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: mockComponentsWithAdmin },
          ],
        }),
        {
          provide: DynamicDialogConfig,
          useValue: { data: { resourceType: ResourceType.Project, isForksContext: true } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockReturnValue(of(void 0));
    fixture.detectChanges();
  });

  it('should not dispatch GetComponents when isForksContext', () => {
    const scientist = component.selectedScientist();
    component.onInputChange(scientist);
    (store.dispatch as jest.Mock).mockClear();

    component.handleDeleteComponent();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(DeleteProject));
    const getComponentsCalls = (store.dispatch as jest.Mock).mock.calls.filter((c) => c[0] instanceof GetComponents);
    expect(getComponentsCalls.length).toBe(0);
  });
});
