import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetResourceWithChildren } from '@osf/shared/stores/current-resource';

import { LoadMoreComponents, ProjectOverviewSelectors, ReorderComponents } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';

import { OverviewComponentsComponent } from './overview-components.component';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ProjectComponentsComponent', () => {
  let component: OverviewComponentsComponent;
  let fixture: ComponentFixture<OverviewComponentsComponent>;
  let store: jest.Mocked<any>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let loaderServiceMock: LoaderServiceMock;
  let toastService: jest.Mocked<ToastService>;
  let createUrlTreeSpy: jest.Mock;
  let serializeUrlSpy: jest.Mock;
  let navigateSpy: jest.Mock;

  const mockComponents: NodeModel[] = [
    { ...MOCK_NODE_WITH_ADMIN, id: 'comp-1', title: 'Component 1' },
    { ...MOCK_NODE_WITH_ADMIN, id: 'comp-2', title: 'Component 2' },
    { ...MOCK_NODE_WITH_ADMIN, id: 'comp-3', title: 'Component 3' },
  ];

  const mockProject = { ...MOCK_NODE_WITH_ADMIN, id: 'project-123', rootParentId: 'root-123' };

  beforeEach(async () => {
    const mockUrlTree = {} as any;
    createUrlTreeSpy = jest.fn().mockReturnValue(mockUrlTree);
    serializeUrlSpy = jest.fn().mockReturnValue('/comp-1');
    navigateSpy = jest.fn().mockResolvedValue(true);

    routerMock = RouterMockBuilder.create().withCreateUrlTree(createUrlTreeSpy).build();
    routerMock.serializeUrl = serializeUrlSpy;
    routerMock.navigate = navigateSpy;

    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    loaderServiceMock = new LoaderServiceMock();
    toastService = { showSuccess: jest.fn() } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [
        OverviewComponentsComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, ContributorsListComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getComponents, value: mockComponents },
            { selector: ProjectOverviewSelectors.getComponentsLoading, value: false },
            { selector: ProjectOverviewSelectors.getComponentsSubmitting, value: false },
            { selector: ProjectOverviewSelectors.hasMoreComponents, value: true },
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
          ],
        }),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        { provide: LoaderService, useValue: loaderServiceMock },
        MockProvider(ToastService, toastService),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));

    fixture = TestBed.createComponent(OverviewComponentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();
  });

  it('should sync reorderedComponents signal with components selector on init', () => {
    expect(component.reorderedComponents()).toEqual(mockComponents);
    expect(component.reorderedComponents().length).toBe(3);
  });

  it('should be true when canEdit is false and reorderedComponents.length <= 1', () => {
    component.reorderedComponents.set([mockComponents[0]]);
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    expect(component.isDragDisabled()).toBe(true);
  });

  it('should be false when canEdit is true and isComponentsSubmitting is false and reorderedComponents.length > 1', () => {
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(component.isDragDisabled()).toBe(false);
  });

  it('should navigate to contributors route when action is manageContributors', () => {
    component.handleMenuAction('manageContributors', 'comp-1');

    expect(navigateSpy).toHaveBeenCalledWith(['comp-1', 'contributors']);
  });

  it('should navigate to settings route when action is settings', () => {
    component.handleMenuAction('settings', 'comp-1');

    expect(navigateSpy).toHaveBeenCalledWith(['comp-1', 'settings']);
  });

  it('should call handleDeleteComponent when action is delete', () => {
    store.dispatch = jest.fn().mockReturnValue(of(true));
    component.handleMenuAction('delete', 'comp-1');

    expect(loaderServiceMock.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        constructor: GetResourceWithChildren,
      })
    );
  });

  it('should open AddComponentDialogComponent with correct config', () => {
    component.handleAddComponent();

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(AddComponentDialogComponent, {
      header: 'project.overview.dialog.addComponent.header',
      width: '850px',
    });
  });

  it('should create URL tree with correct path and queryParamsHandling', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    component.handleComponentNavigate('comp-1');

    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/', 'comp-1'], {
      queryParamsHandling: 'preserve',
    });

    windowOpenSpy.mockRestore();
  });

  it('should serialize URL and open in same window', () => {
    const mockUrlTree = {} as any;
    createUrlTreeSpy.mockReturnValue(mockUrlTree);
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    component.handleComponentNavigate('comp-1');

    expect(serializeUrlSpy).toHaveBeenCalledWith(mockUrlTree);
    expect(windowOpenSpy).toHaveBeenCalledWith('/comp-1', '_self');

    windowOpenSpy.mockRestore();
  });

  it('should dispatch loadMoreComponents action with project id when project exists', () => {
    component.loadMoreComponents();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(LoadMoreComponents));
    const dispatchedAction = (store.dispatch as jest.Mock).mock.calls[0][0];
    expect(dispatchedAction.projectId).toBe(mockProject.id);
  });

  it('should reorder components and dispatch reorderComponents action when project exists and canEdit is true', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 2,
      container: { data: mockComponents },
      previousContainer: { data: mockComponents },
    } as any;

    store.dispatch = jest.fn().mockReturnValue(of(true));

    component.onReorder(event);

    expect(component.reorderedComponents()[0].id).toBe('comp-2');
    expect(component.reorderedComponents()[2].id).toBe('comp-1');
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ReorderComponents));
    const dispatchedAction = (store.dispatch as jest.Mock).mock.calls[0][0];
    expect(dispatchedAction.projectId).toBe(mockProject.id);
    expect(dispatchedAction.componentIds).toEqual(['comp-2', 'comp-3', 'comp-1']);
  });

  it('should show success toast after successful reorder', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      container: { data: mockComponents },
      previousContainer: { data: mockComponents },
    } as any;

    store.dispatch = jest.fn().mockReturnValue(of(true));

    component.onReorder(event);

    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.reorderComponents.success');
  });

  it('should return early when canEdit is false', () => {
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    const event = {
      previousIndex: 0,
      currentIndex: 1,
      container: { data: mockComponents },
      previousContainer: { data: mockComponents },
    } as any;

    store.dispatch.mockClear();

    component.onReorder(event);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should show and hide loader on error', () => {
    loaderServiceMock.hide.mockClear();

    let subscribeError: ((error: any) => void) | undefined;
    const mockObservable = {
      subscribe: jest.fn((callbacks: any) => {
        subscribeError = callbacks.error;
        return { unsubscribe: jest.fn() };
      }),
    };

    store.dispatch = jest.fn().mockReturnValue(mockObservable as any);

    component.handleMenuAction('delete', 'comp-1');

    expect(loaderServiceMock.show).toHaveBeenCalled();

    if (subscribeError) {
      subscribeError(new Error('Test error'));
    }

    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('should use rootParentId if available, otherwise project id', () => {
    store.dispatch = jest.fn().mockReturnValue(of(true));

    component.handleMenuAction('delete', 'comp-1');

    expect(store.dispatch).toHaveBeenCalled();
    const dispatchedAction = (store.dispatch as jest.Mock).mock.calls[0][0];
    expect(dispatchedAction.rootParentId).toBe(mockProject.rootParentId);
  });
});
