import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { GetCustomItemMetadata, MetadataSelectors } from '@osf/features/metadata/store';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { FundersListComponent } from '@osf/shared/components/funders-list/funders-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';
import { FetchLicense, LicensesSelectors } from '@osf/shared/stores/licenses';
import { RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import {
  GetRegistryIdentifiers,
  GetRegistryInstitutions,
  RegistrySelectors,
  SetRegistryCustomCitation,
} from '../../store/registry';

import { RegistryOverviewMetadataComponent } from './registry-overview-metadata.component';

const MOCK_REGISTRY = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, id: 'registry-123', licenseId: 'license-123' };

interface SetupOverrides extends BaseSetupOverrides {
  registry?: typeof MOCK_REGISTRY | null;
}

describe('RegistryOverviewMetadataComponent', () => {
  let store: Store;
  let mockRouter: RouterMockType;

  function setup(overrides: SetupOverrides = {}) {
    const registryValue = 'registry' in overrides ? overrides.registry! : MOCK_REGISTRY;
    mockRouter = RouterMockBuilder.create().build();

    const defaultSignals: SignalOverride[] = [
      { selector: RegistrySelectors.getRegistry, value: registryValue },
      { selector: RegistrySelectors.isRegistryAnonymous, value: false },
      { selector: RegistrySelectors.hasWriteAccess, value: true },
      { selector: LicensesSelectors.getLicense, value: null },
      { selector: LicensesSelectors.isLicenseLoading, value: false },
      { selector: RegistrySelectors.getIdentifiers, value: [] },
      { selector: RegistrySelectors.isIdentifiersLoading, value: false },
      { selector: RegistrySelectors.getInstitutions, value: [] },
      { selector: RegistrySelectors.isInstitutionsLoading, value: false },
      { selector: RegistrationProviderSelectors.getBrandedProvider, value: null },
      { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
      { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
      { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
      { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
      { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
      { selector: MetadataSelectors.getCustomItemMetadata, value: null },
      { selector: MetadataSelectors.isCustomItemMetadataLoading, value: false },
    ];

    TestBed.configureTestingModule({
      imports: [
        RegistryOverviewMetadataComponent,
        ...MockComponents(
          ResourceCitationsComponent,
          AffiliatedInstitutionsViewComponent,
          ContributorsListComponent,
          ResourceDoiComponent,
          ResourceLicenseComponent,
          SubjectsListComponent,
          TagsListComponent,
          FundersListComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    const fixture = TestBed.createComponent(RegistryOverviewMetadataComponent);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance };
  }

  it('should dispatch all init actions when registry exists', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryInstitutions('registry-123'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects('registry-123', ResourceType.Registration));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicense('license-123'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryIdentifiers('registry-123'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetCustomItemMetadata('registry-123'));
  });

  it('should not dispatch init actions when registry is null', () => {
    setup({ registry: null });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch SetRegistryCustomCitation on onCustomCitationUpdated', () => {
    const { component } = setup();
    (store.dispatch as Mock).mockClear();

    component.onCustomCitationUpdated('Custom Citation');

    expect(store.dispatch).toHaveBeenCalledWith(new SetRegistryCustomCitation('Custom Citation'));
  });

  it('should dispatch LoadMoreBibliographicContributors on handleLoadMoreContributors', () => {
    const { component } = setup();
    (store.dispatch as Mock).mockClear();

    component.handleLoadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors('registry-123', ResourceType.Registration)
    );
  });

  it('should not dispatch on handleLoadMoreContributors when registry is null', () => {
    const { component } = setup({ registry: null });
    (store.dispatch as Mock).mockClear();

    component.handleLoadMoreContributors();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to search on tagClicked', () => {
    const { component } = setup();

    component.tagClicked('test-tag');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: 'test-tag' } });
  });

  it('should show associated project section if registry has associated project and is not a project registration', () => {
    const { fixture } = setup({
      registry: { ...MOCK_REGISTRY, associatedProjectId: 'project-123', hasProject: true },
    });
    const associatedProjectSection = fixture.nativeElement.querySelector(
      '[data-test-registry-overview-metadata-associated-project-link]'
    );
    expect(associatedProjectSection).not.toBeNull();
  });

  it('should hide associated project section if registry has no associated project', () => {
    const { fixture } = setup({ registry: { ...MOCK_REGISTRY, associatedProjectId: 'abc123', hasProject: false } });
    const associatedProjectSection = fixture.nativeElement.querySelector(
      '[data-test-registry-overview-metadata-associated-project-link]'
    );
    expect(associatedProjectSection).toBeNull();

    const { fixture: fixture2 } = setup({
      registry: { ...MOCK_REGISTRY, associatedProjectId: undefined, hasProject: true },
    });
    const associatedProjectSection2 = fixture2.nativeElement.querySelector(
      '[data-test-registry-overview-metadata-associated-project-link]'
    );
    expect(associatedProjectSection2).toBeNull();
  });
});
