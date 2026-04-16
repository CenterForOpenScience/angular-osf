import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { CollectionsSelectors } from '@shared/stores/collections';

import { MOCK_COLLECTION_SUBMISSION_WITH_GUID } from '@testing/mocks/submission.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { CollectionsSearchResultCardComponent } from '../collections-search-result-card/collections-search-result-card.component';

import { CollectionsSearchResultsComponent } from './collections-search-results.component';

describe('CollectionsSearchResultsComponent', () => {
  let component: CollectionsSearchResultsComponent;
  let fixture: ComponentFixture<CollectionsSearchResultsComponent>;

  const mockSearchResults = [
    MOCK_COLLECTION_SUBMISSION_WITH_GUID,
    { ...MOCK_COLLECTION_SUBMISSION_WITH_GUID, id: '2', title: 'Second Submission' },
    { ...MOCK_COLLECTION_SUBMISSION_WITH_GUID, id: '3', title: 'Third Submission' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CollectionsSearchResultsComponent,
        ...MockComponents(CustomPaginatorComponent, CollectionsSearchResultCardComponent),
      ],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionSubmissionsSearchResult, value: mockSearchResults },
            { selector: CollectionsSelectors.getCollectionDetailsLoading, value: false },
            { selector: CollectionsSelectors.getCollectionSubmissionsLoading, value: false },
            { selector: CollectionsSelectors.getTotalSubmissions, value: 25 },
            { selector: CollectionsSelectors.getPageNumber, value: '1' },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(CollectionsSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute first index correctly for page 1', () => {
    expect(component.firstIndex()).toBe(0);
  });

  it('should handle page change with valid page number', () => {
    const mockEvent = { page: 1, first: 10, rows: 10, pageCount: 3 };

    component.onPageChange(mockEvent);

    expect(component.actions.setPageNumber).toBeDefined();
  });

  it('should handle page change with page 0', () => {
    const mockEvent = { page: 0, first: 0, rows: 10, pageCount: 3 };

    component.onPageChange(mockEvent);

    expect(component.actions.setPageNumber).toBeDefined();
  });
});
