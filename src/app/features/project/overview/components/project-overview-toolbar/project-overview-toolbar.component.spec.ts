import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { BookmarksSelectors, GetResourceBookmark } from '@osf/shared/stores/bookmarks';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ProjectOverviewModel } from '../../models';
import { TogglePublicityDialogComponent } from '../toggle-publicity-dialog/toggle-publicity-dialog.component';

import { ProjectOverviewToolbarComponent } from './project-overview-toolbar.component';

interface SetupOverrides extends BaseSetupOverrides {
  selectors?: any[];
}

describe('ProjectOverviewToolbarComponent', () => {
  let component: ProjectOverviewToolbarComponent;
  let fixture: ComponentFixture<ProjectOverviewToolbarComponent>;
  let store: Store;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastService: ToastServiceMockType;

  const mockResource: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-123',
    title: 'Test Project',
    isPublic: true,
  } as ProjectOverviewModel;

  const mockStorage: NodeStorageModel = {
    id: 'storage-123',
    storageLimitStatus: 'ok',
    storageUsage: '500MB',
  };

  function setup(overrides: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    toastService = ToastServiceMock.simple();
    const defaultSelectors = [
      { selector: BookmarksSelectors.getBookmarksCollectionId, value: 'bookmarks-123' },
      { selector: BookmarksSelectors.getBookmarks, value: [] },
      { selector: BookmarksSelectors.areBookmarksLoading, value: false },
      { selector: BookmarksSelectors.getBookmarksCollectionIdSubmitting, value: false },
      { selector: ProjectOverviewSelectors.getDuplicatedProject, value: null },
      { selector: UserSelectors.isAuthenticated, value: true },
      { selector: UserSelectors.isProjectCreationDisabled, value: false },
      { selector: UserSelectors.isProjectReadOnly, value: false },
    ];
    const signals = mergeSignalOverrides(defaultSelectors, overrides.selectors);

    TestBed.configureTestingModule({
      imports: [ProjectOverviewToolbarComponent, ...MockComponents(SocialsShareButtonComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals,
        }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastService),
      ],
    });

    store = TestBed.inject(Store);
    store.dispatch = vi.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(ProjectOverviewToolbarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.componentRef.setInput('storage', mockStorage);
    fixture.componentRef.setInput('viewOnly', false);
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  describe('Input Bindings', () => {
    it('should set canEdit input correctly', () => {
      setup();
      fixture.componentRef.setInput('canEdit', false);
      fixture.detectChanges();

      expect(component.canEdit()).toBe(false);
    });

    it('should set currentResource input correctly', () => {
      setup();
      expect(component.currentResource()).toEqual(mockResource);
    });

    it('should set storage input correctly', () => {
      setup();
      expect(component.storage()).toEqual(mockStorage);
    });

    it('should default viewOnly to false', () => {
      setup();
      expect(component.viewOnly()).toBe(false);
    });

    it('should set viewOnly input correctly', () => {
      setup();
      fixture.componentRef.setInput('viewOnly', true);
      fixture.detectChanges();

      expect(component.viewOnly()).toBe(true);
    });
  });

  describe('Effects', () => {
    it('should set isPublic from currentResource', () => {
      setup();
      fixture.detectChanges();

      expect(component.isPublic()).toBe(true);
    });

    it('should dispatch getResourceBookmark when bookmarksId and resource exist', () => {
      setup();
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetResourceBookmark));
    });
  });

  describe('handleToggleProjectPublicity', () => {
    it('should open TogglePublicityDialogComponent with makePrivate header when project is public', () => {
      setup();
      fixture.detectChanges();

      component.handleToggleProjectPublicity();

      expect(customDialogServiceMock.open).toHaveBeenCalledWith(TogglePublicityDialogComponent, {
        header: 'project.overview.dialog.makePrivate.header',
        width: '600px',
        data: {
          projectId: 'project-123',
          isCurrentlyPublic: true,
        },
      });
    });

    it('should open TogglePublicityDialogComponent with makePublic header when project is private', () => {
      setup();
      fixture.componentRef.setInput('currentResource', { ...mockResource, isPublic: false });
      fixture.detectChanges();

      component.handleToggleProjectPublicity();

      expect(customDialogServiceMock.open).toHaveBeenCalledWith(TogglePublicityDialogComponent, {
        header: 'project.overview.dialog.makePublic.header',
        width: '600px',
        data: {
          projectId: 'project-123',
          isCurrentlyPublic: false,
        },
      });
    });

    it('should not open dialog when resource is null', () => {
      setup();
      fixture.componentRef.setInput('currentResource', null as any);
      fixture.detectChanges();

      component.handleToggleProjectPublicity();

      expect(customDialogServiceMock.open).not.toHaveBeenCalled();
    });

    it('should compute disableProjectPrivacyToggle when isProjectReadOnly is false', () => {
      setup();
      fixture.detectChanges();

      expect(component.isPublic()).toBe(true);
      expect(component.disableProjectPrivacyToggle()).toBe(false);

      fixture.componentRef.setInput('currentResource', { ...mockResource, isPublic: false });
      fixture.detectChanges();

      expect(component.isPublic()).toBe(false);
      expect(component.disableProjectPrivacyToggle()).toBe(false);
    });

    it('should compute disableProjectPrivacyToggle when isProjectReadOnly is true', () => {
      setup({ selectors: [{ selector: UserSelectors.isProjectReadOnly, value: true }] });
      fixture.detectChanges();

      expect(component.isPublic()).toBe(true);
      expect(component.disableProjectPrivacyToggle()).toBe(true);

      fixture.componentRef.setInput('currentResource', { ...mockResource, isPublic: false });
      fixture.detectChanges();

      expect(component.isPublic()).toBe(false);
      expect(component.disableProjectPrivacyToggle()).toBe(false);
    });
  });

  describe('Properties', () => {
    it('should have ResourceType property', () => {
      setup();
      expect(component.ResourceType).toBe(ResourceType);
    });

    it('should have resourceType set to Project', () => {
      setup();
      expect(component.resourceType).toBe(ResourceType.Project);
    });
  });

  describe('preventDuplicateCreation', () => {
    it('should return false when isProjectCreationDisabled is false', () => {
      setup();
      expect(component.preventDuplicateCreation()).toBe(false);
    });

    it('should return true when isProjectCreationDisabled is true', () => {
      setup({
        selectors: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }],
      });
      fixture.detectChanges();
      expect(component.preventDuplicateCreation()).toBe(true);
    });
  });

  describe('projectReadOnlyTooltip', () => {
    it('should return empty string when isProjectReadOnly is false', () => {
      setup();
      expect(component.projectReadOnlyTooltip()).toBe('');

      fixture.componentRef.setInput('currentResource', { ...mockResource, isPublic: false });
      fixture.detectChanges();
      expect(component.projectReadOnlyTooltip()).toBe('');
    });

    it('should return tooltip message when isProjectReadOnly is true', () => {
      setup({
        selectors: [{ selector: UserSelectors.isProjectReadOnly, value: true }],
      });
      fixture.detectChanges();
      expect(component.projectReadOnlyTooltip()).toBe('common.errorMessages.actionUnavailable');

      fixture.componentRef.setInput('currentResource', { ...mockResource, isPublic: false });
      fixture.detectChanges();
      expect(component.projectReadOnlyTooltip()).toBe('');
    });
  });
});
