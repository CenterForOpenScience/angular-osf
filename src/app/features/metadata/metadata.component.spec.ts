import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { MetadataTabsComponent } from '@osf/shared/components/metadata-tabs/metadata-tabs.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { SignpostingService } from '@osf/shared/services/signposting.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CollectionsSelectors, GetProjectSubmissions } from '@osf/shared/stores/collections';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
} from '@osf/shared/stores/contributors';
import { FetchResourceInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';
import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores/subjects';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { MOCK_PROJECT_METADATA } from '@testing/mocks/project-metadata.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import {
  CustomDialogServiceMock,
  CustomDialogServiceMockBuilder,
} from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { SignpostingServiceMock } from '@testing/providers/signposting-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

import { MetadataAffiliatedInstitutionsComponent } from './components/metadata-affiliated-institutions/metadata-affiliated-institutions.component';
import { MetadataCollectionsComponent } from './components/metadata-collections/metadata-collections.component';
import { MetadataContributorsComponent } from './components/metadata-contributors/metadata-contributors.component';
import { MetadataDateInfoComponent } from './components/metadata-date-info/metadata-date-info.component';
import { MetadataDescriptionComponent } from './components/metadata-description/metadata-description.component';
import { MetadataFundingComponent } from './components/metadata-funding/metadata-funding.component';
import { MetadataLicenseComponent } from './components/metadata-license/metadata-license.component';
import { MetadataPublicationDoiComponent } from './components/metadata-publication-doi/metadata-publication-doi.component';
import { MetadataRegistrationDoiComponent } from './components/metadata-registration-doi/metadata-registration-doi.component';
import { MetadataRegistryInfoComponent } from './components/metadata-registry-info/metadata-registry-info.component';
import { MetadataResourceInformationComponent } from './components/metadata-resource-information/metadata-resource-information.component';
import { MetadataSubjectsComponent } from './components/metadata-subjects/metadata-subjects.component';
import { MetadataTagsComponent } from './components/metadata-tags/metadata-tags.component';
import { MetadataTitleComponent } from './components/metadata-title/metadata-title.component';
import { AffiliatedInstitutionsDialogComponent } from './dialogs/affiliated-institutions-dialog/affiliated-institutions-dialog.component';
import { ContributorsDialogComponent } from './dialogs/contributors-dialog/contributors-dialog.component';
import { DescriptionDialogComponent } from './dialogs/description-dialog/description-dialog.component';
import { EditTitleDialogComponent } from './dialogs/edit-title-dialog/edit-title-dialog.component';
import { FundingDialogComponent } from './dialogs/funding-dialog/funding-dialog.component';
import { LicenseDialogComponent } from './dialogs/license-dialog/license-dialog.component';
import { PublicationDoiDialogComponent } from './dialogs/publication-doi-dialog/publication-doi-dialog.component';
import { ResourceInformationDialogComponent } from './dialogs/resource-information-dialog/resource-information-dialog.component';
import { ResourceInfoTooltipComponent } from './dialogs/resource-tooltip-info/resource-tooltip-info.component';
import { MetadataComponent } from './metadata.component';
import {
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetResourceMetadata,
  MetadataSelectors,
  UpdateResourceDetails,
  UpdateResourceLicense,
} from './store';

describe('MetadataComponent', () => {
  let component: MetadataComponent;
  let fixture: ComponentFixture<MetadataComponent>;
  let store: Store;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let signpostingServiceMock: ReturnType<typeof SignpostingServiceMock.simple>;

  const defaultResourceId = 'test-resource-id';
  const mockMetadata = {
    ...MOCK_PROJECT_METADATA,
    license: MOCK_LICENSE,
  };

  interface SetupOverrides extends BaseSetupOverrides {
    resourceType?: ResourceType;
    detectChanges?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    const resourceType = overrides.resourceType ?? ResourceType.Project;
    const resourceId = overrides.routeParams?.['id'] ?? defaultResourceId;

    const activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParentRoute({
        snapshot: {
          data: { resourceType },
        },
        parent: {
          snapshot: {
            params: { id: resourceId },
          },
        },
      } as never)
      .build();

    const defaultSignals: SignalOverride[] = [
      { selector: MetadataSelectors.getResourceMetadata, value: mockMetadata },
      { selector: MetadataSelectors.getLoading, value: false },
      { selector: MetadataSelectors.getSubmitting, value: false },
      { selector: MetadataSelectors.getCustomItemMetadata, value: null },
      { selector: MetadataSelectors.getCedarRecords, value: [] },
      { selector: MetadataSelectors.getCedarTemplates, value: null },
      { selector: MetadataSelectors.hasWriteAccess, value: true },
      { selector: MetadataSelectors.hasAdminAccess, value: true },
      { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
      { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
      { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
      { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
      { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
      { selector: InstitutionsSelectors.getResourceInstitutions, value: [] },
      { selector: InstitutionsSelectors.areResourceInstitutionsLoading, value: false },
      { selector: InstitutionsSelectors.areResourceInstitutionsSubmitting, value: false },
      { selector: CollectionsSelectors.getCurrentProjectSubmissions, value: [] },
      { selector: CollectionsSelectors.getCurrentProjectSubmissionsLoading, value: false },
      { selector: RegistrationProviderSelectors.getBrandedProvider, value: null },
      { selector: UserSelectors.isProjectReadOnly, value: false },
    ];

    routerMock = RouterMockBuilder.create().build();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create()
      .withOpen(
        vi.fn().mockReturnValue({
          onClose: {
            pipe: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
            subscribe: vi.fn(),
          },
          close: vi.fn(),
        })
      )
      .build();
    toastServiceMock = ToastServiceMockBuilder.create().build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();
    signpostingServiceMock = SignpostingServiceMock.simple();

    TestBed.configureTestingModule({
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
          MetadataRegistrationDoiComponent,
          MetadataCollectionsComponent,
          MetadataRegistryInfoComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(SignpostingService, signpostingServiceMock),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(MetadataComponent);
    component = fixture.componentInstance;

    if (overrides.detectChanges !== false) {
      fixture.detectChanges();
    }
  }

  it('should load project metadata resources on init', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetResourceMetadata(defaultResourceId, ResourceType.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new GetCustomItemMetadata(defaultResourceId));
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetBibliographicContributors(defaultResourceId, ResourceType.Project)
    );
    expect(store.dispatch).toHaveBeenCalledWith(new FetchResourceInstitutions(defaultResourceId, ResourceType.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new GetCedarMetadataRecords(defaultResourceId, ResourceType.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new GetCedarMetadataTemplates());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects(defaultResourceId, ResourceType.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectSubmissions(defaultResourceId));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubjects(ResourceType.Project));
    expect(signpostingServiceMock.addMetadataSignposting).toHaveBeenCalledWith(defaultResourceId);
  });

  it('should not fetch project submissions for registrations', () => {
    setup({ resourceType: ResourceType.Registration });

    expect(store.dispatch).not.toHaveBeenCalledWith(new GetProjectSubmissions(defaultResourceId));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSubjects(ResourceType.Registration, 'osf'));
  });

  it('should remove signposting tags on destroy', () => {
    setup();

    fixture.destroy();

    expect(signpostingServiceMock.removeSignpostingLinkTags).toHaveBeenCalled();
  });

  it('should compute loading and resource type flags', () => {
    setup({
      selectorOverrides: [{ selector: MetadataSelectors.getLoading, value: true }],
    });

    expect(component.isLoading()).toBe(true);
    expect(component.isProjectType()).toBe(true);
    expect(component.isRegistrationType()).toBe(false);
  });

  it('should hide edit doi for public projects that already have identifiers', () => {
    setup();

    expect(component.hideEditDoi()).toBe(true);
  });

  it('should mark tags and subjects read-only when project is read-only', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.isProjectReadOnly, value: true }],
    });

    expect(component.isTagsReadOnly()).toBe(true);
    expect(component.isSubjectsReadOnly()).toBe(true);
    expect(component.disabledButtonTooltip()).toBe('common.errorMessages.actionUnavailable');
  });

  it('should select osf tab without navigation', () => {
    setup();
    const navigateSpy = vi.spyOn(routerMock, 'navigate');

    component.onTabChange('osf');

    expect(component.selectedTab()).toBe('osf');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should toggle cedar edit mode', () => {
    setup();
    const initialReadonly = component.cedarFormReadonly();

    component.toggleEditMode();

    expect(component.cedarFormReadonly()).toBe(!initialReadonly);
  });

  it('should dispatch metadata update when tags change', () => {
    setup();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    component.onTagsChanged(['tag1', 'tag2']);

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceDetails(defaultResourceId, ResourceType.Project, { tags: ['tag1', 'tag2'] })
    );
  });

  it('should load more contributors', () => {
    setup();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    component.handleLoadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(defaultResourceId, ResourceType.Project)
    );
  });

  it('should fetch and update subjects', () => {
    setup();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    component.getSubjectChildren('parent-1');
    component.searchSubjects('psychology');
    component.updateSelectedSubjects([{ id: 'subject-1' } as never]);

    expect(store.dispatch).toHaveBeenCalledWith(new FetchChildrenSubjects('parent-1'));
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchSubjects(ResourceType.Project, component.provider, 'psychology')
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceSubjects(defaultResourceId, ResourceType.Project, [{ id: 'subject-1' } as never])
    );
  });

  it('should open metadata edit dialogs with expected components', () => {
    setup();
    const openSpy = customDialogServiceMock.open;

    component.openEditTitleDialog();
    component.openEditDescriptionDialog();
    component.openEditResourceInformationDialog();
    component.onShowResourceInfo();
    component.openEditFundingDialog();
    component.openEditAffiliatedInstitutionsDialog();
    component.openEditContributorDialog();

    expect(openSpy).toHaveBeenCalledWith(EditTitleDialogComponent, expect.objectContaining({ width: '500px' }));
    expect(openSpy).toHaveBeenCalledWith(DescriptionDialogComponent, expect.objectContaining({ width: '500px' }));
    expect(openSpy).toHaveBeenCalledWith(
      ResourceInformationDialogComponent,
      expect.objectContaining({ width: '500px' })
    );
    expect(openSpy).toHaveBeenCalledWith(ResourceInfoTooltipComponent, expect.objectContaining({ width: '850px' }));
    expect(openSpy).toHaveBeenCalledWith(FundingDialogComponent, expect.objectContaining({ width: '600px' }));
    expect(openSpy).toHaveBeenCalledWith(
      AffiliatedInstitutionsDialogComponent,
      expect.objectContaining({ width: '500px' })
    );
    expect(openSpy).toHaveBeenCalledWith(
      ContributorsDialogComponent,
      expect.objectContaining({
        data: {
          resourceId: defaultResourceId,
          resourceType: ResourceType.Project,
        },
      })
    );
  });

  it('should open license dialog with typed license data', () => {
    setup();

    component.openEditLicenseDialog();

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(
      LicenseDialogComponent,
      expect.objectContaining({
        header: 'project.metadata.license.dialog.header',
        width: '600px',
        data: {
          metadata: mockMetadata,
          resourceType: ResourceType.Project,
          providerId: component.provider,
        },
      })
    );
  });

  it('should update resource license when license dialog closes with a result', () => {
    setup();
    customDialogServiceMock.open.mockReturnValue(
      CustomDialogServiceMock.dialogRefWithClose(
        of({
          licenseId: MOCK_LICENSE.id,
          licenseOptions: { year: '2024', copyrightHolders: 'Jane Doe' },
        })
      )
    );
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();
    (store.dispatch as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

    component.openEditLicenseDialog();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceLicense(defaultResourceId, ResourceType.Project, MOCK_LICENSE.id, {
        year: '2024',
        copyrightHolders: 'Jane Doe',
      })
    );
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('project.metadata.license.updated');
  });

  it('should confirm doi creation for projects', () => {
    setup();

    component.handleEditDoi();

    expect(customConfirmationServiceMock.confirmDelete).toHaveBeenCalled();
  });

  it('should open publication doi dialog for registrations', () => {
    setup({ resourceType: ResourceType.Registration });

    component.handleEditDoi();

    expect(customDialogServiceMock.open).toHaveBeenCalledWith(
      PublicationDoiDialogComponent,
      expect.objectContaining({
        header: 'project.metadata.doi.dialog.header',
        data: mockMetadata.publicationDoi,
      })
    );
  });

  it('should navigate when opening add record or changing cedar template', () => {
    setup();
    const navigateSpy = vi.spyOn(routerMock, 'navigate');

    component.openAddRecord();
    component.onCedarFormChangeTemplate();

    expect(navigateSpy).toHaveBeenCalledTimes(2);
  });
});
