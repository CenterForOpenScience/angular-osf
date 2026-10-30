import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { throwError } from 'rxjs';

import { Mock } from 'vitest';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { DeleteResourceService } from '@osf/features/project/settings/services/delete-resource.service';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import {
  DeleteResourceServiceMock,
  DeleteResourceServiceMockType,
} from '@testing/providers/delete-resource-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { GetComponents, LoadMoreComponents, ProjectOverviewSelectors, ReorderComponents } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';
import { ComponentCardComponent } from '../component-card/component-card.component';

import { OverviewComponentsComponent } from './overview-components.component';

describe('OverviewComponentsComponent', () => {
  let component: OverviewComponentsComponent;
  let fixture: ComponentFixture<OverviewComponentsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastService: ToastServiceMockType;
  let deleteResourceService: DeleteResourceServiceMockType;

  const mockUrlTree = {} as UrlTree;
  const componentA = { id: 'comp-a', title: 'Component A' } as NodeModel;
  const componentB = { id: 'comp-b', title: 'Component B' } as NodeModel;
  const components = [componentA, componentB];
  const project = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-1',
    rootParentId: 'root-1',
  };

  const defaultSignals: SignalOverride[] = [
    { selector: ProjectOverviewSelectors.getComponents, value: components },
    { selector: ProjectOverviewSelectors.getComponentsLoading, value: false },
    { selector: ProjectOverviewSelectors.getComponentsSubmitting, value: false },
    { selector: ProjectOverviewSelectors.hasMoreComponents, value: true },
    { selector: ProjectOverviewSelectors.getProject, value: project },
    { selector: UserSelectors.isProjectCreationDisabled, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    routerMock = RouterMockBuilder.create()
      .withCreateUrlTree(vi.fn().mockReturnValue(mockUrlTree))
      .withSerializeUrl(vi.fn().mockReturnValue('/comp-a'))
      .build();
    customDialogService = CustomDialogServiceMockBuilder.create().build();
    toastService = ToastServiceMock.simple();
    deleteResourceService = DeleteResourceServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [OverviewComponentsComponent, MockComponent(ComponentCardComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(ToastService, toastService),
        MockProvider(DeleteResourceService, deleteResourceService),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(OverviewComponentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should initialize reorderedComponents from components selector', () => {
    setup();

    expect(component.reorderedComponents()).toEqual(components);
  });

  it('should disable drag when user cannot edit', () => {
    setup();
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    expect(component.isDragDisabled()).toBe(true);
  });

  it('should disable drag while components are submitting', () => {
    setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getComponentsSubmitting, value: true }],
    });

    expect(component.isDragDisabled()).toBe(true);
  });

  it('should disable drag when there is only one component', () => {
    setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getComponents, value: [componentA] }],
    });

    expect(component.isDragDisabled()).toBe(true);
  });

  it('should open add component dialog', () => {
    setup();

    component.handleAddComponent();

    expect(customDialogService.open).toHaveBeenCalledWith(AddComponentDialogComponent, {
      header: 'project.overview.dialog.addComponent.header',
      width: '850px',
    });
  });

  it('should not open add component dialog when project creation is disabled', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }],
    });

    component.handleAddComponent();

    expect(component.preventComponentCreation()).toBe(true);
    expect(component.createComponentTooltip()).toBe('project.overview.components.addComponentDisabled');
    expect(customDialogService.open).not.toHaveBeenCalled();
  });

  it('should navigate for manageContributors action', () => {
    setup();

    component.handleMenuAction(NodeMenuAction.ManageContributors, 'comp-a');

    expect(routerMock.navigate).toHaveBeenCalledWith(['comp-a', 'contributors']);
  });

  it('should navigate for settings action', () => {
    setup();

    component.handleMenuAction(NodeMenuAction.Settings, 'comp-a');

    expect(routerMock.navigate).toHaveBeenCalledWith(['comp-a', 'settings']);
  });

  it('should run delete resource flow through delete menu action', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.handleMenuAction(NodeMenuAction.Delete, 'comp-a');
    deleteResourceService.deleteComponent.mock.calls[0][0].onSuccess();

    expect(deleteResourceService.deleteComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        rootParentId: 'root-1',
        resourceId: 'comp-a',
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(new GetComponents('project-1'));
  });

  it('should open component url in same tab on navigate', () => {
    setup();

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.handleComponentNavigate('comp-a');

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/', 'comp-a'], { queryParamsHandling: 'preserve' });
    expect(routerMock.serializeUrl).toHaveBeenCalledWith(mockUrlTree);
    expect(window.open).toHaveBeenCalledWith('/comp-a', '_self');
    openSpy.mockRestore();
  });

  it('should dispatch load more components when project exists', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.loadMoreComponents();

    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreComponents('project-1'));
  });

  it('should reorder components and dispatch reorder action', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    const event = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<NodeModel[]>;

    component.onReorder(event);

    expect(component.reorderedComponents().map((c) => c.id)).toEqual(['comp-b', 'comp-a']);
    expect(store.dispatch).toHaveBeenCalledWith(new ReorderComponents('project-1', ['comp-b', 'comp-a']));
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.reorderComponents.success');
  });

  it('should not reorder when canEdit is false', () => {
    setup();
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();
    (store.dispatch as Mock).mockClear();
    const event = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<NodeModel[]>;

    component.onReorder(event);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ReorderComponents));
  });

  it('should restore previous order when reorder fails', () => {
    setup();
    (store.dispatch as Mock).mockReturnValueOnce(throwError(() => new Error('reorder failed')));
    const event = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<NodeModel[]>;

    component.onReorder(event);

    expect(component.reorderedComponents().map((c) => c.id)).toEqual(['comp-a', 'comp-b']);
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
