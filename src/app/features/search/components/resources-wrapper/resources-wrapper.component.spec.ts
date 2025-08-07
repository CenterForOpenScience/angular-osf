import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourcesComponent } from '@osf/features/search/components';
import { ResourceTab } from '@osf/shared/enums';
import { MOCK_STORE } from '@osf/shared/mocks';

import { SearchSelectors } from '../../store';
import { GetAllOptions } from '../filters/store';
import { ResourceFiltersSelectors } from '../resource-filters/store';

import { ResourcesWrapperComponent } from './resources-wrapper.component';

describe.skip('ResourcesWrapperComponent', () => {
  let component: ResourcesWrapperComponent;
  let fixture: ComponentFixture<ResourcesWrapperComponent>;
  let store: jest.Mocked<Store>;

  const mockStore = MOCK_STORE;

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
