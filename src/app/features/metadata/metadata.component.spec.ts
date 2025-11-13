import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import {
  MetadataAffiliatedInstitutionsComponent,
  MetadataContributorsComponent,
  MetadataDateInfoComponent,
  MetadataDescriptionComponent,
  MetadataFundingComponent,
  MetadataLicenseComponent,
  MetadataPublicationDoiComponent,
  MetadataRegistrationDoiComponent,
  MetadataResourceInformationComponent,
  MetadataSubjectsComponent,
  MetadataTagsComponent,
  MetadataTitleComponent,
} from '@osf/features/metadata/components';
import { MetadataSelectors } from '@osf/features/metadata/store';
import { MetadataTabsComponent } from '@osf/shared/components/metadata-tabs/metadata-tabs.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MetadataComponent } from './metadata.component';

import { MOCK_PROJECT_METADATA } from '@testing/mocks/project-metadata.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('MetadataComponent', () => {
  let component: MetadataComponent;
  let fixture: ComponentFixture<MetadataComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockMetadata = MOCK_PROJECT_METADATA;
  const mockResourceId = 'test-resource-id';

  beforeEach(async () => {
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withId(mockResourceId)
      .withData({ resourceType: ResourceType.Project })
      .build();

    Object.defineProperty(activatedRouteMock, 'parent', {
      value: {
        snapshot: {
          data: { resourceType: ResourceType.Project },
        },
      },
      writable: true,
      configurable: true,
    });

    routerMock = RouterMockBuilder.create().build();

    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    toastServiceMock = ToastServiceMockBuilder.create().build();

    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        MetadataComponent,
        ...MockComponents(
          SubHeaderComponent,
          MetadataTabsComponent,
          MetadataSubjectsComponent,
          MetadataPublicationDoiComponent,
          MetadataLicenseComponent,
          MetadataAffiliatedInstitutionsComponent,
          MetadataDescriptionComponent,
          MetadataContributorsComponent,
          MetadataResourceInformationComponent,
          MetadataFundingComponent,
          MetadataDateInfoComponent,
          MetadataTagsComponent,
          MetadataTitleComponent,
          MetadataRegistrationDoiComponent
        ),
        OSFTestingModule,
      ],
      providers: [
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        provideMockStore({
          selectors: [
            { selector: MetadataSelectors.getResourceMetadata, value: mockMetadata },
            { selector: MetadataSelectors.getLoading, value: false },
            { selector: MetadataSelectors.getSubmitting, value: false },
            { selector: MetadataSelectors.getCedarRecords, value: [] },
            { selector: MetadataSelectors.getCedarTemplates, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle tab change for OSF tab', () => {
    const tabId = 'osf';
    const navigateSpy = jest.spyOn(routerMock, 'navigate');

    component.onTabChange(tabId);

    expect(component.selectedTab()).toBe(tabId);
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });

  it('should toggle edit mode', () => {
    const initialReadonly = component.cedarFormReadonly();

    component.toggleEditMode();

    expect(component.cedarFormReadonly()).toBe(!initialReadonly);
  });

  it('should handle tags changed', () => {
    const tags = ['tag1', 'tag2'];

    expect(() => component.onTagsChanged(tags)).not.toThrow();
  });

  it('should open edit contributor dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    expect(openSpy).toHaveBeenCalledTimes(0);
    expect(() => component.openEditContributorDialog()).toThrow();
    expect(openSpy).toHaveBeenCalled();
  });

  it('should open edit title dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.openEditTitleDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should open edit description dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.openEditDescriptionDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should open edit resource information dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.openEditResourceInformationDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should show resource info tooltip', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.onShowResourceInfo();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should open edit license dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.openEditLicenseDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should open edit funding dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.openEditFundingDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should open edit affiliated institutions dialog', () => {
    const openSpy = jest.spyOn(customDialogServiceMock, 'open');

    component.openEditAffiliatedInstitutionsDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should handle subject children fetch', () => {
    const parentId = 'parent-subject-id';

    expect(() => component.getSubjectChildren(parentId)).not.toThrow();
  });

  it('should handle subject search', () => {
    const searchTerm = 'test search';

    expect(() => component.searchSubjects(searchTerm)).not.toThrow();
  });

  it('should handle edit DOI for project', () => {
    const confirmSpy = jest.spyOn(customConfirmationServiceMock, 'confirmDelete');

    component.handleEditDoi();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should open add record', () => {
    const navigateSpy = jest.spyOn(routerMock, 'navigate');

    component.openAddRecord();

    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should handle cedar form change template', () => {
    const navigateSpy = jest.spyOn(routerMock, 'navigate');

    component.onCedarFormChangeTemplate();

    expect(navigateSpy).toHaveBeenCalled();
  });
});
