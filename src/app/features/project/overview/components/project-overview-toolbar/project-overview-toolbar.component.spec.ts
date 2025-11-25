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

import { ProjectOverviewModel } from '../../models';
import { TogglePublicityDialogComponent } from '../toggle-publicity-dialog/toggle-publicity-dialog.component';

import { ProjectOverviewToolbarComponent } from './project-overview-toolbar.component';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ProjectOverviewToolbarComponent', () => {
  let component: ProjectOverviewToolbarComponent;
  let fixture: ComponentFixture<ProjectOverviewToolbarComponent>;
  let store: jest.Mocked<any>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastService: jest.Mocked<ToastService>;

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

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().build();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    toastService = { showSuccess: jest.fn() } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [ProjectOverviewToolbarComponent, OSFTestingModule, ...MockComponents(SocialsShareButtonComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: BookmarksSelectors.getBookmarksCollectionId, value: 'bookmarks-123' },
            { selector: BookmarksSelectors.getBookmarks, value: [] },
            { selector: BookmarksSelectors.areBookmarksLoading, value: false },
            { selector: BookmarksSelectors.getBookmarksCollectionIdSubmitting, value: false },
            { selector: ProjectOverviewSelectors.getDuplicatedProject, value: null },
            { selector: UserSelectors.isAuthenticated, value: true },
          ],
        }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastService),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(ProjectOverviewToolbarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.componentRef.setInput('storage', mockStorage);
    fixture.componentRef.setInput('viewOnly', false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Bindings', () => {
    it('should set canEdit input correctly', () => {
      fixture.componentRef.setInput('canEdit', false);
      fixture.detectChanges();

      expect(component.canEdit()).toBe(false);
    });

    it('should set currentResource input correctly', () => {
      expect(component.currentResource()).toEqual(mockResource);
    });

    it('should set storage input correctly', () => {
      expect(component.storage()).toEqual(mockStorage);
    });

    it('should default viewOnly to false', () => {
      expect(component.viewOnly()).toBe(false);
    });

    it('should set viewOnly input correctly', () => {
      fixture.componentRef.setInput('viewOnly', true);
      fixture.detectChanges();

      expect(component.viewOnly()).toBe(true);
    });
  });

  describe('Effects', () => {
    it('should set isPublic from currentResource', () => {
      fixture.detectChanges();

      expect(component.isPublic()).toBe(true);
    });

    it('should dispatch getResourceBookmark when bookmarksId and resource exist', () => {
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetResourceBookmark));
    });
  });

  describe('handleToggleProjectPublicity', () => {
    it('should open TogglePublicityDialogComponent with makePrivate header when project is public', () => {
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
      fixture.componentRef.setInput('currentResource', null as any);
      fixture.detectChanges();

      component.handleToggleProjectPublicity();

      expect(customDialogServiceMock.open).not.toHaveBeenCalled();
    });
  });

  describe('Properties', () => {
    it('should have ResourceType property', () => {
      expect(component.ResourceType).toBe(ResourceType);
    });

    it('should have resourceType set to Registration', () => {
      expect(component.resourceType).toBe(ResourceType.Registration);
    });
  });
});
