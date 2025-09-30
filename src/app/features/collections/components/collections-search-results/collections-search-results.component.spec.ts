import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsSearchResultCardComponent } from '@osf/features/collections/components';
import { CustomPaginatorComponent } from '@shared/components';
import { CollectionsSelectors } from '@shared/stores/collections';

import { CollectionsSearchResultsComponent } from './collections-search-results.component';

import { MOCK_COLLECTION_SUBMISSION_WITH_GUID } from '@testing/mocks/submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CollectionsSearchResultsComponent', () => {
  let component: CollectionsSearchResultsComponent;
  let fixture: ComponentFixture<CollectionsSearchResultsComponent>;

  const mockSearchResults = [
    MOCK_COLLECTION_SUBMISSION_WITH_GUID,
    { ...MOCK_COLLECTION_SUBMISSION_WITH_GUID, id: '2', title: 'Second Submission' },
    { ...MOCK_COLLECTION_SUBMISSION_WITH_GUID, id: '3', title: 'Third Submission' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionsSearchResultsComponent,
        ...MockComponents(CustomPaginatorComponent, CollectionsSearchResultCardComponent),
        OSFTestingModule,
      ],
      providers: [
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
    }).compileComponents();

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
