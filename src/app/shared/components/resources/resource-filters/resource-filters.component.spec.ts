import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SearchSelectors } from '@osf/features/search/store';
import { CreatorsFilterComponent } from '@shared/components/resources/resource-filters/filters/creators/creators-filter.component';
import { DateCreatedFilterComponent } from '@shared/components/resources/resource-filters/filters/date-created/date-created-filter.component';
import { FunderFilterComponent } from '@shared/components/resources/resource-filters/filters/funder/funder-filter.component';
import { InstitutionFilterComponent } from '@shared/components/resources/resource-filters/filters/institution-filter/institution-filter.component';
import { LicenseFilterComponent } from '@shared/components/resources/resource-filters/filters/license-filter/license-filter.component';
import { PartOfCollectionFilterComponent } from '@shared/components/resources/resource-filters/filters/part-of-collection-filter/part-of-collection-filter.component';
import { ProviderFilterComponent } from '@shared/components/resources/resource-filters/filters/provider-filter/provider-filter.component';
import { ResourceTypeFilterComponent } from '@shared/components/resources/resource-filters/filters/resource-type-filter/resource-type-filter.component';
import { ResourceFiltersOptionsSelectors } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.selectors';
import { SubjectFilterComponent } from '@shared/components/resources/resource-filters/filters/subject/subject-filter.component';

import { ResourceFiltersComponent } from './resource-filters.component';

describe('ResourceFiltersComponent', () => {
  let component: ResourceFiltersComponent;
  let fixture: ComponentFixture<ResourceFiltersComponent>;

  const mockStore = {
    selectSignal: jest.fn().mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getDatesCreated) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getFunders) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getSubjects) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getLicenses) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getResourceTypes) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getInstitutions) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getProviders) return () => [];
      if (selector === ResourceFiltersOptionsSelectors.getPartOfCollection) return () => [];
      if (selector === SearchSelectors.getIsMyProfile) return () => false;
      return () => null;
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResourceFiltersComponent,
        ...MockComponents(
          CreatorsFilterComponent,
          DateCreatedFilterComponent,
          SubjectFilterComponent,
          FunderFilterComponent,
          LicenseFilterComponent,
          ResourceTypeFilterComponent,
          ProviderFilterComponent,
          PartOfCollectionFilterComponent,
          InstitutionFilterComponent
        ),
      ],
      providers: [MockProvider(Store, mockStore), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
