import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';
import { RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import {
  GetRegistryIdentifiers,
  GetRegistryInstitutions,
  GetRegistryLicense,
  RegistrySelectors,
  SetRegistryCustomCitation,
} from '../../store/registry';

import { RegistryOverviewMetadataComponent } from './registry-overview-metadata.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_REGISTRY = { ...MOCK_REGISTRATION_OVERVIEW_MODEL, id: 'registry-123', licenseId: 'license-123' };

interface SetupOverrides {
  registry?: typeof MOCK_REGISTRY | null;
}

function setup(overrides: SetupOverrides = {}) {
  const registryValue = 'registry' in overrides ? overrides.registry! : MOCK_REGISTRY;
  const mockRouter = RouterMockBuilder.create().build();

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
        TagsListComponent
      ),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
      MockProvider(Router, mockRouter),
      provideMockStore({
        signals: [
          { selector: RegistrySelectors.getRegistry, value: registryValue },
          { selector: RegistrySelectors.isRegistryAnonymous, value: false },
          { selector: RegistrySelectors.hasWriteAccess, value: true },
          { selector: RegistrySelectors.getLicense, value: null },
          { selector: RegistrySelectors.isLicenseLoading, value: false },
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
        ],
      }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryOverviewMetadataComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, store, mockRouter };
}

describe('RegistryOverviewMetadataComponent', () => {
  it('should dispatch all init actions when registry exists', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ registryId: 'registry-123' }));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetRegistryInstitutions));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchSelectedSubjects));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetRegistryLicense));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetRegistryIdentifiers));
  });

  it('should not dispatch init actions when registry is null', () => {
    const { store } = setup({ registry: null });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch SetRegistryCustomCitation on onCustomCitationUpdated', () => {
    const { component, store } = setup();

    component.onCustomCitationUpdated('Custom Citation');

    const call = (store.dispatch as jest.Mock).mock.calls.find((c) => c[0] instanceof SetRegistryCustomCitation);
    expect(call).toBeDefined();
    expect(call[0].citation).toBe('Custom Citation');
  });

  it('should dispatch LoadMoreBibliographicContributors on handleLoadMoreContributors', () => {
    const { component, store } = setup();
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.handleLoadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors('registry-123', ResourceType.Registration)
    );
  });

  it('should not dispatch on handleLoadMoreContributors when registry is null', () => {
    const { component, store } = setup({ registry: null });
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.handleLoadMoreContributors();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to search on tagClicked', () => {
    const { component, mockRouter } = setup();

    component.tagClicked('test-tag');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: 'test-tag' } });
  });
});
