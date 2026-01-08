import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';
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
import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryOverviewMetadataComponent', () => {
  let component: RegistryOverviewMetadataComponent;
  let fixture: ComponentFixture<RegistryOverviewMetadataComponent>;
  let store: jest.Mocked<Store>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;

  const mockRegistry = {
    ...MOCK_REGISTRATION_OVERVIEW_MODEL,
    id: 'registry-123',
    licenseId: 'license-123',
  };

  const mockEnvironment = {
    webUrl: 'https://test.osf.io',
  };

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        RegistryOverviewMetadataComponent,
        OSFTestingModule,
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
        provideMockStore({
          signals: [
            { selector: RegistrySelectors.getRegistry, value: mockRegistry },
            { selector: RegistrySelectors.isRegistryAnonymous, value: false },
            { selector: RegistrySelectors.hasWriteAccess, value: true },
            { selector: RegistrySelectors.getLicense, value: null },
            { selector: RegistrySelectors.isLicenseLoading, value: false },
            { selector: RegistrySelectors.getIdentifiers, value: [] },
            { selector: RegistrySelectors.isIdentifiersLoading, value: false },
            { selector: RegistrySelectors.getInstitutions, value: [] },
            { selector: RegistrySelectors.isInstitutionsLoading, value: false },
            { selector: SubjectsSelectors.getSubjects, value: [] },
            { selector: SubjectsSelectors.getSubjectsLoading, value: false },
            { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
            { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
          ],
        }),
        { provide: Router, useValue: routerMock },
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(RegistryOverviewMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should have currentResourceType set to Registrations', () => {
    expect(component.currentResourceType).toBe(CurrentResourceType.Registrations);
  });

  it('should have correct dateFormat', () => {
    expect(component.dateFormat).toBe('MMM d, y, h:mm a');
  });

  it('should have webUrl from environment', () => {
    expect(component.webUrl).toBe('https://test.osf.io');
  });

  it('should dispatch actions when registry exists', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetRegistryInstitutions));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchSelectedSubjects));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetRegistryLicense));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetRegistryIdentifiers));
  });

  it('should dispatch GetRegistryInstitutions with correct registryId', () => {
    fixture.detectChanges();

    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof GetRegistryInstitutions);
    expect(call).toBeDefined();
    const action = call[0] as GetRegistryInstitutions;
    expect(action.registryId).toBe('registry-123');
  });

  it('should dispatch FetchSelectedSubjects with correct parameters', () => {
    fixture.detectChanges();

    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof FetchSelectedSubjects);
    expect(call).toBeDefined();
    const action = call[0] as FetchSelectedSubjects;
    expect(action.resourceId).toBe('registry-123');
    expect(action.resourceType).toBe(ResourceType.Registration);
  });

  it('should dispatch GetRegistryLicense with licenseId from registry', () => {
    fixture.detectChanges();

    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof GetRegistryLicense);
    expect(call).toBeDefined();
    const action = call[0] as GetRegistryLicense;
    expect(action.licenseId).toBe('license-123');
  });

  it('should dispatch GetRegistryIdentifiers with correct registryId', () => {
    fixture.detectChanges();

    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof GetRegistryIdentifiers);
    expect(call).toBeDefined();
    const action = call[0] as GetRegistryIdentifiers;
    expect(action.registryId).toBe('registry-123');
  });

  it('should dispatch SetRegistryCustomCitation with citation', () => {
    const citation = 'Custom Citation Text';
    component.onCustomCitationUpdated(citation);

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(SetRegistryCustomCitation));
    const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof SetRegistryCustomCitation);
    expect(call).toBeDefined();
    const action = call[0] as SetRegistryCustomCitation;
    expect(action.citation).toBe(citation);
  });

  it('should dispatch LoadMoreBibliographicContributors with registry id', () => {
    component.handleLoadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(LoadMoreBibliographicContributors));
    const call = (store.dispatch as jest.Mock).mock.calls.find(
      (call) => call[0] instanceof LoadMoreBibliographicContributors
    );
    expect(call).toBeDefined();
    const action = call[0] as LoadMoreBibliographicContributors;
    expect(action.resourceId).toBe('registry-123');
    expect(action.resourceType).toBe(ResourceType.Registration);
  });

  it('should navigate to search page with tag as query param', () => {
    const tag = 'test-tag';
    component.tagClicked(tag);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: tag } });
  });
});
