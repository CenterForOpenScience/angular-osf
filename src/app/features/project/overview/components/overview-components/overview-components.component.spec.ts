import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetResourceWithChildren } from '@osf/shared/stores/current-resource';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { LoadMoreComponents, ProjectOverviewSelectors, ReorderComponents } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';
import { ComponentCardComponent } from '../component-card/component-card.component';
import { DeleteComponentDialogComponent } from '../delete-component-dialog/delete-component-dialog.component';

import { OverviewComponentsComponent } from './overview-components.component';

describe('OverviewComponentsComponent', () => {
  let component: OverviewComponentsComponent;
  let fixture: ComponentFixture<OverviewComponentsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;

  const componentA = { id: 'comp-a', title: 'Component A' } as NodeModel;
  const componentB = { id: 'comp-b', title: 'Component B' } as NodeModel;
  const components = [componentA, componentB];
  const project = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-1',
    rootParentId: 'root-1',
  };

  beforeEach(() => {
    routerMock = RouterMockBuilder.create().build();
    customDialogService = CustomDialogServiceMockBuilder.create().build();
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [OverviewComponentsComponent, MockComponent(ComponentCardComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getComponents, value: components },
            { selector: ProjectOverviewSelectors.getComponentsLoading, value: false },
            { selector: ProjectOverviewSelectors.getComponentsSubmitting, value: false },
            { selector: ProjectOverviewSelectors.hasMoreComponents, value: true },
            { selector: ProjectOverviewSelectors.getProject, value: project },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(OverviewComponentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize reorderedComponents from components selector', () => {
    expect(component.reorderedComponents()).toEqual(components);
  });

  it('should open add component dialog', () => {
    component.handleAddComponent();

    expect(customDialogService.open).toHaveBeenCalledWith(AddComponentDialogComponent, {
      header: 'project.overview.dialog.addComponent.header',
      width: '850px',
    });
  });

  it('should navigate for manageContributors action', () => {
    component.handleMenuAction('manageContributors', 'comp-a');

    expect(routerMock.navigate).toHaveBeenCalledWith(['comp-a', 'contributors']);
  });

  it('should navigate for settings action', () => {
    component.handleMenuAction('settings', 'comp-a');

    expect(routerMock.navigate).toHaveBeenCalledWith(['comp-a', 'settings']);
  });

  it('should open delete component dialog through delete menu action', () => {
    component.handleMenuAction('delete', 'comp-a');

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new GetResourceWithChildren('root-1', 'comp-a', ResourceType.Project));
    expect(customDialogService.open).toHaveBeenCalledWith(DeleteComponentDialogComponent, {
      header: 'project.overview.dialog.deleteComponent.header',
      width: '650px',
      data: { componentId: 'comp-a', resourceType: ResourceType.Project },
    });
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should open component url in same tab on navigate', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    vi.spyOn(routerMock, 'createUrlTree').mockReturnValue({} as any);
    vi.spyOn(routerMock, 'serializeUrl').mockReturnValue('/comp-a');

    component.handleComponentNavigate('comp-a');

    expect(window.open).toHaveBeenCalledWith('/comp-a', '_self');
    openSpy.mockRestore();
  });

  it('should dispatch load more components when project exists', () => {
    (store.dispatch as Mock).mockClear();

    component.loadMoreComponents();

    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreComponents('project-1'));
  });

  it('should reorder components and dispatch reorder action', () => {
    (store.dispatch as Mock).mockClear();
    const event = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<NodeModel[]>;

    component.onReorder(event);

    expect(component.reorderedComponents().map((c) => c.id)).toEqual(['comp-b', 'comp-a']);
    expect(store.dispatch).toHaveBeenCalledWith(new ReorderComponents('project-1', ['comp-b', 'comp-a']));
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.reorderComponents.success');
  });

  it('should not reorder when canEdit is false', () => {
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();
    (store.dispatch as Mock).mockClear();
    const event = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<NodeModel[]>;

    component.onReorder(event);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ReorderComponents));
  });
});
