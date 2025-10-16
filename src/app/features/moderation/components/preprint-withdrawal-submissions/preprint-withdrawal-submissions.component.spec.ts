import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintSubmissionItemComponent } from '@osf/features/moderation/components';
import { PreprintWithdrawalSubmission } from '@osf/features/moderation/models';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent, SelectComponent } from '@shared/components';

import { PreprintSubmissionsSort, SubmissionReviewStatus } from '../../enums';
import { PreprintModerationSelectors } from '../../store/preprint-moderation';

import { PreprintWithdrawalSubmissionsComponent } from './preprint-withdrawal-submissions.component';

import { MOCK_PREPRINT_WITHDRAWAL_SUBMISSIONS } from '@testing/mocks/preprint-withdrawal-submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintWithdrawalSubmissionsComponent', () => {
  let component: PreprintWithdrawalSubmissionsComponent;
  let fixture: ComponentFixture<PreprintWithdrawalSubmissionsComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProviderId = 'test-provider-id';
  const mockSubmissions: PreprintWithdrawalSubmission[] = MOCK_PREPRINT_WITHDRAWAL_SUBMISSIONS;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockRouter.serializeUrl = jest.fn(
      (urlTree: any) => `/preprints/${mockProviderId}/${urlTree.segments?.[2] || 'test-id'}?mode=moderator`
    );
    mockRouter.createUrlTree = jest.fn(
      (commands: any[], extras?: any) =>
        ({
          segments: commands,
          queryParams: extras?.queryParams || {},
        }) as any
    );

    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withQueryParams({ status: 'pending' })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintWithdrawalSubmissionsComponent,
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
            { selector: PreprintModerationSelectors.getPreprintWithdrawalSubmissions, value: mockSubmissions },
            { selector: PreprintModerationSelectors.arePreprintWithdrawalSubmissionsLoading, value: false },
            { selector: PreprintModerationSelectors.getPreprintWithdrawalSubmissionsPendingCount, value: 1 },
            { selector: PreprintModerationSelectors.getPreprintWithdrawalSubmissionsAcceptedCount, value: 0 },
            { selector: PreprintModerationSelectors.getPreprintWithdrawalSubmissionsRejectedCount, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintWithdrawalSubmissionsComponent);
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
    expect(component.actions.getPreprintWithdrawalSubmissions).toBeDefined();
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
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    component.navigateToPreprint(mockItem);

    expect(windowOpenSpy).toHaveBeenCalledWith(expect.stringContaining('/preprints/'), '_blank');

    windowOpenSpy.mockRestore();
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
