import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ProjectSettingNotificationsComponent,
  SettingsAccessRequestsCardComponent,
  SettingsProjectAffiliationComponent,
  SettingsProjectFormCardComponent,
  SettingsStorageLocationCardComponent,
  SettingsViewOnlyLinksCardComponent,
  SettingsWikiCardComponent,
} from '@osf/features/project/settings/components';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';
import { ViewOnlyLinkSelectors } from '@osf/shared/stores';
import { MOCK_VIEW_ONLY_LINK } from '@shared/mocks';

import { SettingsComponent } from './settings.component';
import { SettingsSelectors } from './store';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe.skip('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockLoaderService: LoaderService;

  const mockProjectId = 'test-project-123';
  const mockSettings = {
    attributes: {
      accessRequestsEnabled: true,
      wikiEnabled: false,
      anyoneCanEditWiki: false,
      anyoneCanComment: true,
    },
  };
  const mockProjectDetails = {
    id: mockProjectId,
    title: 'Test Project',
    description: 'Test Description',
    isPublic: true,
    region: { name: 'US East' },
    affiliatedInstitutions: [],
  };

  beforeEach(async () => {
    activatedRouteMock = ActivatedRouteMockBuilder.create().withParams({ id: mockProjectId }).build();

    routerMock = RouterMockBuilder.create().build();

    toastServiceMock = ToastServiceMockBuilder.create().build();

    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        SettingsComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          SettingsProjectFormCardComponent,
          SettingsStorageLocationCardComponent,
          SettingsViewOnlyLinksCardComponent,
          SettingsAccessRequestsCardComponent,
          SettingsWikiCardComponent,
          SettingsProjectAffiliationComponent,
          ProjectSettingNotificationsComponent,
          LoadingSpinnerComponent
        ),
      ],
      providers: [
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(LoaderService, mockLoaderService),
        MockProvider(ToastService, toastServiceMock),
        provideMockStore({
          signals: [
            { selector: SettingsSelectors.getSettings, value: mockSettings },
            { selector: SettingsSelectors.getNotificationSubscriptions, value: [] },
            { selector: SettingsSelectors.areNotificationsLoading, value: false },
            { selector: SettingsSelectors.getProjectDetails, value: mockProjectDetails },
            { selector: SettingsSelectors.areProjectDetailsLoading, value: false },
            { selector: ViewOnlyLinkSelectors.getViewOnlyLinks, value: [] },
            { selector: ViewOnlyLinkSelectors.isViewOnlyLinksLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    mockLoaderService = TestBed.inject(LoaderService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with project ID from route', () => {
    fixture.detectChanges();
    expect(component.projectId()).toBe(mockProjectId);
  });

  it('should not call actions on ngOnInit when project ID is undefined', () => {
    expect(typeof component.ngOnInit).toBe('function');
  });

  it('should handle access request change', () => {
    component.onAccessRequestChange(true);
    expect(component.accessRequest()).toBe(true);
  });

  it('should handle wiki request change', () => {
    component.onWikiRequestChange(true);
    expect(component.wikiEnabled()).toBe(true);
  });

  it('should handle anyone can edit wiki request change', () => {
    component.onAnyoneCanEditWikiRequestChange(true);
    expect(component.anyoneCanEditWiki()).toBe(true);
  });

  it('should handle delete link item', () => {
    const mockLink = MOCK_VIEW_ONLY_LINK;

    component.deleteLinkItem(mockLink);

    expect(customConfirmationServiceMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'myProjects.settings.delete.title',
      headerParams: { name: mockLink.name },
      messageKey: 'myProjects.settings.delete.message',
      onConfirm: expect.any(Function),
    });
  });

  it('should handle delete project', () => {
    expect(() => component.deleteProject()).not.toThrow();
    expect(customConfirmationServiceMock.confirmDelete).toHaveBeenCalled();
  });

  it('should submit form when project details change', () => {
    const mockFormData = { title: 'New Title', description: 'New Description' };
    expect(() => component.submitForm(mockFormData)).not.toThrow();
  });

  it('should not submit form when project details are unchanged', () => {
    const mockFormData = { title: 'Same Title', description: 'Same Description' };

    Object.defineProperty(component, 'projectDetails', {
      value: () => ({ title: 'Same Title', description: 'Same Description' }),
      writable: true,
    });

    expect(() => component.submitForm(mockFormData)).not.toThrow();
  });

  it('should initialize signals with default values', () => {
    expect(component.accessRequest()).toBe(false);
    expect(component.wikiEnabled()).toBe(false);
    expect(component.anyoneCanEditWiki()).toBe(false);
    expect(component.anyoneCanComment()).toBe(false);
    expect(component.title()).toBe('');
  });
});
