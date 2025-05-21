import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';
import { SearchSelectors } from '@osf/features/search/store';
import { GetAllOptions } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store';
import { ResourcesComponent } from '@shared/components/resources/resources.component';

import { ResourcesWrapperComponent } from './resources-wrapper.component';

describe('ResourcesWrapperComponent', () => {
  let component: ResourcesWrapperComponent;
  let fixture: ComponentFixture<ResourcesWrapperComponent>;
  let store: jest.Mocked<Store>;

  const mockStore = {
    selectSignal: jest.fn(),
    dispatch: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockRoute = {
    queryParamMap: of({
      get: jest.fn(),
    }),
    snapshot: {
      queryParams: {},
      queryParamMap: {
        get: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersSelectors.getCreator) return () => null;
      if (selector === ResourceFiltersSelectors.getDateCreated) return () => null;
      if (selector === ResourceFiltersSelectors.getFunder) return () => null;
      if (selector === ResourceFiltersSelectors.getSubject) return () => null;
      if (selector === ResourceFiltersSelectors.getLicense) return () => null;
      if (selector === ResourceFiltersSelectors.getResourceType) return () => null;
      if (selector === ResourceFiltersSelectors.getInstitution) return () => null;
      if (selector === ResourceFiltersSelectors.getProvider) return () => null;
      if (selector === ResourceFiltersSelectors.getPartOfCollection) return () => null;
      if (selector === SearchSelectors.getSortBy) return () => '-relevance';
      if (selector === SearchSelectors.getSearchText) return () => '';
      if (selector === SearchSelectors.getResourceTab) return () => ResourceTab.All;
      if (selector === SearchSelectors.getIsMyProfile) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ResourcesWrapperComponent, MockComponent(ResourcesComponent)],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        MockProvider(Store, mockStore),
        MockProvider(Router, mockRouter),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesWrapperComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty query params', () => {
    expect(store.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
