import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { ForkProject } from '@osf/features/project/overview/store';
import { DeleteResourceService } from '@osf/features/project/settings/services/delete-resource.service';
import { ForkRegistry } from '@osf/features/registry/store/registry';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';
import { ClearDuplicates, DuplicatesSelectors, GetAllDuplicates } from '@osf/shared/stores/duplicates';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  DeleteResourceServiceMock,
  DeleteResourceServiceMockType,
} from '@testing/providers/delete-resource-provider.mock';
import { ForkDialogServiceMock, ForkDialogServiceMockType } from '@testing/providers/fork-dialog.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { DuplicateCardComponent } from '../duplicate-card/duplicate-card.component';

import { ViewDuplicatesComponent } from './view-duplicates.component';

interface SetupOverrides extends BaseSetupOverrides {
  resourceType?: ResourceType;
}

describe('ViewDuplicatesComponent', () => {
  let component: ViewDuplicatesComponent;
  let fixture: ComponentFixture<ViewDuplicatesComponent>;
  let store: Store;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let forkDialogService: ForkDialogServiceMockType;
  let deleteResourceService: DeleteResourceServiceMockType;

  function setup(overrides: SetupOverrides = {}) {
    forkDialogService = ForkDialogServiceMock.simple();
    deleteResourceService = DeleteResourceServiceMock.simple();
    routerMock = RouterMockBuilder.create().build();

    const routeBuilder = ActivatedRouteMockBuilder.create()
      .withParams(overrides.routeParams ?? { id: 'rid' })
      .withData({ resourceType: overrides.resourceType ?? ResourceType.Project });

    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }

    const defaultSelectors = [
      { selector: DuplicatesSelectors.getDuplicates, value: [] },
      { selector: DuplicatesSelectors.getDuplicatesLoading, value: false },
      { selector: DuplicatesSelectors.getDuplicatesTotalCount, value: 0 },
      { selector: UserSelectors.isAuthenticated, value: true },
      { selector: UserSelectors.isProjectCreationDisabled, value: false },
    ];

    TestBed.configureTestingModule({
      imports: [
        ViewDuplicatesComponent,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          CustomPaginatorComponent,
          DuplicateCardComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSelectors, overrides.selectorOverrides),
        }),
        MockProvider(ForkDialogService, forkDialogService),
        MockProvider(DeleteResourceService, deleteResourceService),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeBuilder.build()),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ViewDuplicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should dispatch getDuplicates on init for a project', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetAllDuplicates('rid', CurrentResourceType.Projects, 1, 10));
  });

  it('should dispatch getDuplicates on init for a registration', () => {
    setup({ resourceType: ResourceType.Registration });

    expect(store.dispatch).toHaveBeenCalledWith(new GetAllDuplicates('rid', CurrentResourceType.Registrations, 1, 10));
  });

  it('should not dispatch getDuplicates when route id is missing', () => {
    setup({ hasParent: false });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetAllDuplicates));
  });

  it('should clear duplicates on destroy', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearDuplicates());
  });

  it('should compute firstIndex from currentPage', () => {
    setup();
    component.currentPage.set(3);
    expect(component.firstIndex()).toBe(20);
  });

  it('should use the projects resource type for a project', () => {
    setup();

    expect(component.apiResourceType()).toBe(CurrentResourceType.Projects);
    expect(component.duplicateButtonLabel()).toBe('project.overview.actions.forkProjectLabel');
  });

  it('should use the registrations resource type for a registration', () => {
    setup({ resourceType: ResourceType.Registration });

    expect(component.apiResourceType()).toBe(CurrentResourceType.Registrations);
    expect(component.duplicateButtonLabel()).toBe('project.overview.actions.duplicateRegistration');
  });

  it('should compute duplicate button tooltip when project creation is disabled', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }],
    });

    expect(component.preventDuplicateCreation()).toBe(true);
    expect(component.duplicateButtonTooltip()).toBe('project.overview.actions.duplicatingProjectsNotAllowed');
  });

  it('should return empty tooltip when project creation is allowed', () => {
    setup();
    expect(component.duplicateButtonTooltip()).toBe('');
  });

  it('should navigate to contributors for the manageContributors action', () => {
    setup();

    component.handleMenuAction(NodeMenuAction.ManageContributors, 'node-1');

    expect(routerMock.navigate).toHaveBeenCalledWith(['node-1', 'contributors']);
  });

  it('should navigate to settings for the settings action', () => {
    setup();

    component.handleMenuAction(NodeMenuAction.Settings, 'node-1');

    expect(routerMock.navigate).toHaveBeenCalledWith(['node-1', 'settings']);
  });

  it('should delete the fork and refresh duplicates on success', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.handleMenuAction(NodeMenuAction.Delete, 'fork-1');
    deleteResourceService.deleteProject.mock.calls[0][0].onSuccess();

    expect(deleteResourceService.deleteProject).toHaveBeenCalledWith(
      expect.objectContaining({
        rootParentId: 'fork-1',
        resourceId: 'fork-1',
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllDuplicates('rid', CurrentResourceType.Projects, 1, 10));
  });

  it('should confirm fork for the current project', () => {
    setup();

    component.handleFork();

    expect(forkDialogService.confirmFork).toHaveBeenCalledWith(
      expect.objectContaining({ resourceType: CurrentResourceType.Projects })
    );
  });

  it('should confirm fork for the current registration', () => {
    setup({ resourceType: ResourceType.Registration });

    component.handleFork();

    expect(forkDialogService.confirmFork).toHaveBeenCalledWith(
      expect.objectContaining({ resourceType: CurrentResourceType.Registrations })
    );
  });

  it('should not confirm fork when route id is missing', () => {
    setup({ hasParent: false });

    component.handleFork();

    expect(forkDialogService.confirmFork).not.toHaveBeenCalled();
  });

  it('should dispatch ForkProject and refresh duplicates from confirmFork callbacks', () => {
    setup();
    component.handleFork();
    const [options] = forkDialogService.confirmFork.mock.calls[0];
    (store.dispatch as Mock).mockClear();

    options.fork();
    options.onSuccess?.();

    expect(store.dispatch).toHaveBeenCalledWith(new ForkProject('rid'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllDuplicates('rid', CurrentResourceType.Projects, 1, 10));
  });

  it('should dispatch ForkRegistry from confirmFork when resource is a registration', () => {
    setup({ resourceType: ResourceType.Registration });
    component.handleFork();
    const [options] = forkDialogService.confirmFork.mock.calls[0];
    (store.dispatch as Mock).mockClear();

    options.fork();

    expect(store.dispatch).toHaveBeenCalledWith(new ForkRegistry('rid'));
  });

  it('should not update currentPage when page is undefined', () => {
    setup();
    component.currentPage.set(5);

    component.onPageChange({ page: undefined });

    expect(component.currentPage()).toBe(5);
  });

  it('should reload duplicates when page changes', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onPageChange({ page: 2 });
    fixture.detectChanges();

    expect(component.currentPage()).toBe(3);
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllDuplicates('rid', CurrentResourceType.Projects, 3, 10));
  });
});
