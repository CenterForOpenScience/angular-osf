import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';

import { PreprintSubmissionsSort, SubmissionReviewStatus } from '../../enums';
import { PreprintSubmissionModel } from '../../models';
import {
  GetPreprintSubmissionContributors,
  LoadMorePreprintSubmissionContributors,
  PreprintModerationSelectors,
} from '../../store/preprint-moderation';
import { PreprintSubmissionItemComponent } from '../preprint-submission-item/preprint-submission-item.component';
import { PreprintSubmissionsComponent } from '..';

import { MOCK_PREPRINT_SUBMISSIONS } from '@testing/mocks/preprint-submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintSubmissionsComponent', () => {
  let component: PreprintSubmissionsComponent;
  let fixture: ComponentFixture<PreprintSubmissionsComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let store: Store;

  const mockProviderId = 'test-provider-id';
  const mockSubmissions: PreprintSubmissionModel[] = MOCK_PREPRINT_SUBMISSIONS;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withQueryParams({ status: 'pending' })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintSubmissionsComponent,
        OSFTestingModule,
        ...MockComponents(
          SelectComponent,
          IconComponent,
          LoadingSpinnerComponent,
          PreprintSubmissionItemComponent,
          CustomPaginatorComponent
        ),
      ],
      providers: [
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [
            { selector: PreprintModerationSelectors.getPreprintSubmissions, value: mockSubmissions },
            { selector: PreprintModerationSelectors.arePreprintSubmissionsLoading, value: false },
            { selector: PreprintModerationSelectors.getPreprintSubmissionsPendingCount, value: 1 },
            { selector: PreprintModerationSelectors.getPreprintSubmissionsAcceptedCount, value: 0 },
            { selector: PreprintModerationSelectors.getPreprintSubmissionsRejectedCount, value: 0 },
            { selector: PreprintModerationSelectors.getPreprintSubmissionsWithdrawnCount, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSubmissionsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(10);
    expect(component.first()).toBe(0);
    expect(component.selectedSortOption()).toBe(PreprintSubmissionsSort.Newest);
    expect(component.selectedReviewOption()).toBeDefined();
  });

  it('should have sort options defined', () => {
    expect(component.sortOptions).toBeDefined();
    expect(component.sortOptions.length).toBeGreaterThan(0);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getPreprintSubmissions).toBeDefined();
  });

  it('should compute submission review options with counts', () => {
    const options = component.submissionReviewOptions();
    expect(options).toBeDefined();
    expect(options.length).toBeGreaterThan(0);
    expect(options[0]).toHaveProperty('count');
  });

  it('should compute total count', () => {
    expect(component.totalCount()).toBeDefined();
  });

  it('should change review status', () => {
    component.changeReviewStatus(SubmissionReviewStatus.Accepted);
    expect(component.selectedReviewOption()).toBe(SubmissionReviewStatus.Accepted);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { status: SubmissionReviewStatus.Accepted },
      })
    );
  });

  it('should change sort option', () => {
    component.changeSort(PreprintSubmissionsSort.Oldest);
    expect(component.selectedSortOption()).toBe(PreprintSubmissionsSort.Oldest);
  });

  it('should handle page change', () => {
    const mockEvent = { page: 1, first: 10, rows: 10 };
    component.onPageChange(mockEvent);
    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
  });

  it('should handle page change when page is undefined', () => {
    const mockEvent = { page: undefined, first: 0, rows: 10 };
    component.onPageChange(mockEvent);
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should get status from query params on init', () => {
    expect(component.selectedReviewOption()).toBe(SubmissionReviewStatus.Pending);
  });

  it('should reset pagination when changing review status', () => {
    component.currentPage.set(3);
    component.first.set(20);

    component.changeReviewStatus(SubmissionReviewStatus.Accepted);

    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should load contributors for a submission', () => {
    const mockItem = mockSubmissions[0];
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.loadContributors(mockItem);

    expect(dispatchSpy).toHaveBeenCalledWith(new GetPreprintSubmissionContributors(mockItem.id));
  });

  it('should load more contributors for a submission', () => {
    const mockItem = mockSubmissions[0];
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.loadMoreContributors(mockItem);

    expect(dispatchSpy).toHaveBeenCalledWith(new LoadMorePreprintSubmissionContributors(mockItem.id));
  });
});
