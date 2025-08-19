import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChipsComponent, ResourceFiltersComponent } from '@osf/features/search/components';
import { ResourceTab } from '@osf/shared/enums';
import { IS_WEB, IS_XSMALL } from '@osf/shared/helpers';
import { MOCK_STORE } from '@osf/shared/mocks';
import { ResourceCardComponent } from '@shared/components/resource-card/resource-card.component';

import { GetResourcesByLink, SearchSelectors } from '../../store';
import { ResourceFiltersOptionsSelectors } from '../filters/store';
import { ResourceFiltersSelectors } from '../resource-filters/store';

import { ResourcesComponent } from './resources.component';

describe.skip('ResourcesComponent', () => {
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;
  let store: jest.Mocked<Store>;
  let isWebSubject: BehaviorSubject<boolean>;
  let isMobileSubject: BehaviorSubject<boolean>;

  const mockStore = MOCK_STORE;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);
    isMobileSubject = new BehaviorSubject<boolean>(false);

    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === SearchSelectors.getResourceTab) return () => ResourceTab.All;
      if (selector === SearchSelectors.getResourcesCount) return () => 100;
      if (selector === SearchSelectors.getResources) return () => [];
      if (selector === SearchSelectors.getSortBy) return () => '-relevance';
      if (selector === SearchSelectors.getFirst) return () => 'first-link';
      if (selector === SearchSelectors.getNext) return () => 'next-link';
      if (selector === SearchSelectors.getPrevious) return () => 'prev-link';
      if (selector === SearchSelectors.getIsMyProfile) return () => false;
      if (selector === ResourceFiltersSelectors.getAllFilters)
        return () => ({
          creator: { value: '' },
          dateCreated: { value: '' },
          funder: { value: '' },
          subject: { value: '' },
          license: { value: '' },
          resourceType: { value: '' },
          institution: { value: '' },
          provider: { value: '' },
          partOfCollection: { value: '' },
        });
      if (selector === ResourceFiltersOptionsSelectors.getAllOptions)
        return () => ({
          datesCreated: [],
          creators: [],
          funders: [],
          subjects: [],
          licenses: [],
          resourceTypes: [],
          institutions: [],
          providers: [],
          partOfCollection: [],
        });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [
        ResourcesComponent,
        ...MockComponents(ResourceFiltersComponent, ResourceCardComponent, FilterChipsComponent),
      ],
      providers: [
        MockProvider(Store, mockStore),
        MockProvider(IS_WEB, isWebSubject),
        MockProvider(IS_XSMALL, isMobileSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesComponent);
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

  it('should switch page and dispatch to store', () => {
    const link = 'next-page-link';
    component.switchPage(link);

    expect(store.dispatch).toHaveBeenCalledWith(new GetResourcesByLink(link));
  });

  it('should show mobile layout when isMobile is true', () => {
    isMobileSubject.next(true);
    fixture.detectChanges();

    const mobileSelect = fixture.nativeElement.querySelector('p-select');
    expect(mobileSelect).toBeTruthy();
  });

  it('should show web layout when isWeb is true', () => {
    isWebSubject.next(true);
    fixture.detectChanges();

    const webSortSelect = fixture.nativeElement.querySelector('.sorting-container p-select');
    expect(webSortSelect).toBeTruthy();
  });
});
