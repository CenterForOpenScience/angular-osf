import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SearchSelectors } from '../../store';
import {
  CreatorsFilterComponent,
  DateCreatedFilterComponent,
  FunderFilterComponent,
  InstitutionFilterComponent,
  LicenseFilterComponent,
  PartOfCollectionFilterComponent,
  ProviderFilterComponent,
  ResourceTypeFilterComponent,
  SubjectFilterComponent,
} from '../filters';
import { ResourceFiltersOptionsSelectors } from '../filters/store';

import { ResourceFiltersComponent } from './resource-filters.component';

describe('MyProfileResourceFiltersComponent', () => {
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
