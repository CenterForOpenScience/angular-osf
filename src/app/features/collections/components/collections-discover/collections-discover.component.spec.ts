import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { CollectionsMainContentComponent } from '@osf/features/collections/components';
import { LoadingSpinnerComponent, SearchInputComponent } from '@shared/components';
import { MOCK_PROVIDER } from '@shared/mocks';
import { CustomDialogService, ToastService } from '@shared/services';
import { CollectionsSelectors } from '@shared/stores';

import { CollectionsDiscoverComponent } from './collections-discover.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('CollectionsDiscoverComponent', () => {
  let component: CollectionsDiscoverComponent;
  let fixture: ComponentFixture<CollectionsDiscoverComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
    mockRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'provider-1' }).build();

    await TestBed.configureTestingModule({
      imports: [
        CollectionsDiscoverComponent,
        ...MockComponents(SearchInputComponent, CollectionsMainContentComponent, LoadingSpinnerComponent),
        OSFTestingModule,
      ],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(SENTRY_TOKEN, { captureException: jest.fn() }),
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionProvider, value: MOCK_PROVIDER },
            { selector: CollectionsSelectors.getCollectionDetails, value: null },
            { selector: CollectionsSelectors.getAllSelectedFilters, value: {} },
            { selector: CollectionsSelectors.getSortBy, value: 'date' },
            { selector: CollectionsSelectors.getSearchText, value: '' },
            { selector: CollectionsSelectors.getPageNumber, value: '1' },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.providerId()).toBe('provider-1');
    expect(component.searchControl.value).toBe('');
  });

  it('should handle search triggered', () => {
    const searchValue = 'test search';

    component.onSearchTriggered(searchValue);

    expect(component).toBeTruthy();
  });

  it('should have provider id signal', () => {
    expect(component.providerId()).toBe('provider-1');
  });

  it('should have collection provider data', () => {
    expect(component.collectionProvider()).toEqual(MOCK_PROVIDER);
  });

  it('should have collection details', () => {
    expect(component.collectionDetails()).toBeNull();
  });

  it('should have selected filters', () => {
    expect(component.selectedFilters()).toEqual({});
  });

  it('should have sort by value', () => {
    expect(component.sortBy()).toBe('date');
  });

  it('should have search text', () => {
    expect(component.searchText()).toBe('');
  });

  it('should have page number', () => {
    expect(component.pageNumber()).toBe('1');
  });

  it('should have loading state', () => {
    expect(component.isProviderLoading()).toBe(false);
  });

  it('should compute primary collection id', () => {
    expect(component.primaryCollectionId()).toBe(MOCK_PROVIDER.primaryCollection?.id);
  });

  it('should handle search control value changes', () => {
    const searchValue = 'new search value';

    component.searchControl.setValue(searchValue);

    expect(component.searchControl.value).toBe(searchValue);
  });
});
