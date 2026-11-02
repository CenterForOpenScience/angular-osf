import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ClearDuplicatedProject, ForkProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ForkMenuButtonComponent } from '@osf/shared/components/fork-menu-button/fork-menu-button.component';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources-item.model';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores/bookmarks';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomDialogServiceMock,
  CustomDialogServiceMockBuilder,
} from '@testing/providers/custom-dialog-provider.mock';
import { ForkDialogServiceMock, ForkDialogServiceMockType } from '@testing/providers/fork-dialog.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ProjectOverviewModel } from '../../models';
import { DuplicateDialogComponent } from '../duplicate-dialog/duplicate-dialog.component';
import { TogglePublicityDialogComponent } from '../toggle-publicity-dialog/toggle-publicity-dialog.component';

import { ProjectOverviewToolbarComponent } from './project-overview-toolbar.component';

interface SetupOverrides extends BaseSetupOverrides {
  isPublic?: boolean;
}

describe('ProjectOverviewToolbarComponent', () => {
  let component: ProjectOverviewToolbarComponent;
  let fixture: ComponentFixture<ProjectOverviewToolbarComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastService: ToastServiceMockType;
  let forkDialogService: ForkDialogServiceMockType;

  const mockStorage: NodeStorageModel = {
    id: 'storage-123',
    storageLimitStatus: 'ok',
    storageUsage: '1500',
  };

  const bookmarkedItem: MyResourcesItem = {
    id: 'project-123',
    dateCreated: '2023-01-01',
    dateModified: '2023-01-01',
    isPublic: true,
    contributors: [],
    title: 'Test Project',
    type: 'nodes',
  };

  function setup(overrides: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create().build();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    toastService = ToastServiceMock.simple();
    forkDialogService = ForkDialogServiceMock.simple();

    const resource: ProjectOverviewModel = {
      ...MOCK_PROJECT_OVERVIEW,
      id: 'project-123',
      title: 'Test Project',
      isPublic: overrides.isPublic ?? true,
      forksCount: 4,
      viewOnlyLinksCount: 2,
    };

    const defaultSignals = [
      { selector: BookmarksSelectors.getBookmarksCollectionId, value: 'bookmarks-123' },
      { selector: BookmarksSelectors.getBookmarks, value: [] },
      { selector: BookmarksSelectors.areBookmarksLoading, value: false },
      { selector: BookmarksSelectors.getBookmarksCollectionIdSubmitting, value: false },
      { selector: ProjectOverviewSelectors.getDuplicatedProject, value: null },
      { selector: UserSelectors.isAuthenticated, value: true },
      { selector: UserSelectors.isProjectCreationDisabled, value: false },
      { selector: UserSelectors.isProjectReadOnly, value: false },
    ];
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [
        ProjectOverviewToolbarComponent,
        ...MockComponents(SocialsShareButtonComponent, ForkMenuButtonComponent),
      ],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        provideMockStore({ signals }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastService),
        MockProvider(ForkDialogService, forkDialogService),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectOverviewToolbarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('currentResource', resource);
    fixture.componentRef.setInput('storage', mockStorage);
    fixture.componentRef.setInput('viewOnly', false);
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should read preventDuplicateCreation from the user state', () => {
    setup({ selectorOverrides: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }] });

    expect(component.preventDuplicateCreation()).toBe(true);
  });

  it('should dispatch GetResourceBookmark on init', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetResourceBookmark('bookmarks-123', 'project-123', ResourceType.Project)
    );
  });

  it('should not dispatch GetResourceBookmark without a bookmarks collection id', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarksCollectionId, value: null }] });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetResourceBookmark));
  });

  it('should mark the project as bookmarked when it is in the bookmarks list', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarks, value: [bookmarkedItem] }] });

    expect(component.isBookmarked()).toBe(true);
  });

  it('should leave the project unbookmarked when it is absent from the bookmarks list', () => {
    setup({
      selectorOverrides: [{ selector: BookmarksSelectors.getBookmarks, value: [{ ...bookmarkedItem, id: 'other' }] }],
    });

    expect(component.isBookmarked()).toBe(false);
  });

  it('should add a bookmark and show a toast when the project is not bookmarked', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      new AddResourceToBookmarks('bookmarks-123', 'project-123', ResourceType.Project)
    );
    expect(component.isBookmarked()).toBe(true);
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.bookmark.add');
  });

  it('should remove a bookmark and show a toast when the project is bookmarked', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarks, value: [bookmarkedItem] }] });
    (store.dispatch as Mock).mockClear();

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      new RemoveResourceFromBookmarks('bookmarks-123', 'project-123', ResourceType.Project)
    );
    expect(component.isBookmarked()).toBe(false);
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.bookmark.remove');
  });

  it('should not toggle a bookmark without a bookmarks collection id', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarksCollectionId, value: null }] });
    (store.dispatch as Mock).mockClear();

    component.toggleBookmark();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should open the make-private dialog for a public project', () => {
    vi.useFakeTimers();
    setup();

    component.handleToggleProjectPublicity();
    vi.advanceTimersByTime(100);

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(TogglePublicityDialogComponent, {
      header: 'project.overview.dialog.makePrivate.header',
      width: '600px',
      data: {
        projectId: 'project-123',
        isCurrentlyPublic: true,
      },
    });
    expect(component.isPublic()).toBe(true);
  });

  it('should open the make-public dialog for a private project', () => {
    vi.useFakeTimers();
    setup({ isPublic: false });

    component.handleToggleProjectPublicity();
    vi.advanceTimersByTime(100);

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(TogglePublicityDialogComponent, {
      header: 'project.overview.dialog.makePublic.header',
      width: '600px',
      data: {
        projectId: 'project-123',
        isCurrentlyPublic: false,
      },
    });
    expect(component.isPublic()).toBe(false);
  });

  it('should disable the privacy toggle when a public project is read only', () => {
    setup({ selectorOverrides: [{ selector: UserSelectors.isProjectReadOnly, value: true }] });

    expect(component.disableProjectPrivacyToggle()).toBe(true);
    expect(component.projectReadOnlyTooltip()).toBe('common.errorMessages.actionUnavailable');
  });

  it('should keep the privacy toggle enabled when a private project is read only', () => {
    setup({
      isPublic: false,
      selectorOverrides: [{ selector: UserSelectors.isProjectReadOnly, value: true }],
    });

    expect(component.disableProjectPrivacyToggle()).toBe(false);
    expect(component.projectReadOnlyTooltip()).toBe('');
  });

  it('should navigate to the duplicates view', () => {
    setup();

    component.forkActionItems[2].command?.({});

    expect(routerMock.navigate).toHaveBeenCalledWith(['../analytics/duplicates'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should open fork confirmation for a project', () => {
    setup();

    component.forkActionItems[0].command?.({});

    expect(forkDialogService.confirmFork).toHaveBeenCalledWith(
      expect.objectContaining({ resourceType: CurrentResourceType.Projects })
    );
  });

  it('should dispatch ForkProject when the fork is confirmed', () => {
    setup();
    component.forkActionItems[0].command?.({});
    const [options] = forkDialogService.confirmFork.mock.calls[0];
    (store.dispatch as Mock).mockClear();

    options.fork();

    expect(store.dispatch).toHaveBeenCalledWith(new ForkProject('project-123'));
  });

  it('should navigate to the duplicated project when the dialog closes', () => {
    setup({
      selectorOverrides: [
        {
          selector: ProjectOverviewSelectors.getDuplicatedProject,
          value: { ...MOCK_PROJECT_OVERVIEW, id: 'copy-1' },
        },
      ],
    });
    const onClose$ = new Subject<void>();
    customDialogServiceMock.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));

    component.forkActionItems[1].command?.({});
    onClose$.next();

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(DuplicateDialogComponent, {
      header: 'project.overview.dialog.duplicate.header',
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'copy-1']);
  });

  it('should clear the duplicated project when the dialog completes', () => {
    setup();
    const onClose$ = new Subject<void>();
    customDialogServiceMock.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$));
    (store.dispatch as Mock).mockClear();

    component.forkActionItems[1].command?.({});
    onClose$.complete();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearDuplicatedProject());
  });
});
