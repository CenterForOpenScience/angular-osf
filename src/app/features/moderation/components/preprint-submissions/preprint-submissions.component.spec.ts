import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintSubmissionItemComponent } from '@osf/features/moderation/components';
import { RegistryModeration } from '@osf/features/moderation/models';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { PreprintSubmissionsSort, SubmissionReviewStatus } from '../../enums';
import { PreprintModerationSelectors } from '../../store/preprint-moderation';

import { PreprintSubmissionsComponent } from './preprint-submissions.component';

import { MOCK_REGISTRY_MODERATIONS } from '@testing/mocks/registry-moderation.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintSubmissionsComponent', () => {
  let component: PreprintSubmissionsComponent;
  let fixture: ComponentFixture<PreprintSubmissionsComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProviderId = 'test-provider-id';
  const mockSubmissions: RegistryModeration[] = MOCK_REGISTRY_MODERATIONS;

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

  it('should navigate to preprint', () => {
    const mockItem = mockSubmissions[0];
    component.navigateToPreprint(mockItem);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/preprints/', mockProviderId, mockItem.id], {
      queryParams: { mode: 'moderator' },
    });
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
});
