import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CollectionSubmissionsListComponent } from '@osf/features/moderation/components';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { CollectionsSelectors } from '@osf/shared/stores/collections';

import { SubmissionReviewStatus } from '../../enums';
import { CollectionsModerationSelectors } from '../../store/collections-moderation';

import { CollectionModerationSubmissionsComponent } from './collection-moderation-submissions.component';

import { MOCK_PROVIDER } from '@testing/mocks/provider.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CollectionModerationSubmissionsComponent', () => {
  let component: CollectionModerationSubmissionsComponent;
  let fixture: ComponentFixture<CollectionModerationSubmissionsComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockCollectionProvider = MOCK_PROVIDER;
  const mockSubmissions = [
    {
      id: '1',
      title: 'Test Submission',
      status: SubmissionReviewStatus.Pending,
    },
  ];

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withQueryParams({ status: 'pending', sortBy: 'date_created', page: '1' })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        CollectionModerationSubmissionsComponent,
        OSFTestingModule,
        ...MockComponents(
          SelectComponent,
          CollectionSubmissionsListComponent,
          IconComponent,
          CustomPaginatorComponent,
          LoadingSpinnerComponent
        ),
      ],
      providers: [
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionProvider, value: mockCollectionProvider },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CollectionsModerationSelectors.getCollectionSubmissionsLoading, value: false },
            { selector: CollectionsModerationSelectors.getCollectionSubmissions, value: mockSubmissions },
            { selector: CollectionsModerationSelectors.getCollectionSubmissionsTotalCount, value: 1 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.reviewStatus()).toBe(SubmissionReviewStatus.Pending);
    expect(component.currentPage()).toBe('1');
    expect(component.pageSize).toBe(10);
    expect(component.selectedSortOption()).toBeDefined();
  });

  it('should change review status', () => {
    component.changeReviewStatus(SubmissionReviewStatus.Accepted);
    expect(component.reviewStatus()).toBe(SubmissionReviewStatus.Accepted);
    expect(component.currentPage()).toBe('1');
  });

  it('should change sort option', () => {
    component.changeSort('title');
    expect(component.selectedSortOption()).toBe('title');
    expect(component.currentPage()).toBe('1');
  });

  it('should handle page change', () => {
    const mockEvent = { page: 1, first: 10, rows: 10 };
    component.onPageChange(mockEvent);
    expect(component.currentPage()).toBe('2');
  });

  it('should handle page change when page is undefined', () => {
    const mockEvent = { page: undefined, first: 0, rows: 10 };
    component.onPageChange(mockEvent);
    expect(component.currentPage()).toBe('1');
  });

  it('should compute firstIndex correctly', () => {
    component.currentPage.set('3');
    expect(component.firstIndex()).toBe(20);
  });

  it('should compute isLoading correctly', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should initialize from query params', () => {
    expect(component.reviewStatus()).toBe(SubmissionReviewStatus.Pending);
    expect(component.selectedSortOption()).toBe('date_created');
    expect(component.currentPage()).toBe('1');
  });
});
