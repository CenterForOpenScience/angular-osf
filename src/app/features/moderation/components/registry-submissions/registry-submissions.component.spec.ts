import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrySubmissionItemComponent } from '@osf/features/moderation/components';
import { RegistryModeration } from '@osf/features/moderation/models';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';

import { RegistrySort, SubmissionReviewStatus } from '../../enums';
import { RegistryModerationSelectors } from '../../store/registry-moderation';

import { RegistrySubmissionsComponent } from './registry-submissions.component';

import { MOCK_REGISTRY_MODERATIONS } from '@testing/mocks/registry-moderation.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistrySubmissionsComponent', () => {
  let component: RegistrySubmissionsComponent;
  let fixture: ComponentFixture<RegistrySubmissionsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

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
        RegistrySubmissionsComponent,
        OSFTestingModule,
        ...MockComponents(
          SelectComponent,
          IconComponent,
          LoadingSpinnerComponent,
          RegistrySubmissionItemComponent,
          CustomPaginatorComponent
        ),
      ],
      providers: [
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [
            { selector: RegistryModerationSelectors.getRegistrySubmissions, value: mockSubmissions },
            { selector: RegistryModerationSelectors.areRegistrySubmissionLoading, value: false },
            { selector: RegistryModerationSelectors.getRegistrySubmissionTotalCount, value: 1 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySubmissionsComponent);
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
    expect(component.selectedSortOption()).toBe(RegistrySort.RegisteredNewest);
    expect(component.selectedReviewOption()).toBeDefined();
  });

  it('should have submission review options defined', () => {
    expect(component.submissionReviewOptions).toBeDefined();
    expect(component.submissionReviewOptions.length).toBeGreaterThan(0);
  });

  it('should have sort options defined', () => {
    expect(component.sortOptions).toBeDefined();
    expect(component.sortOptions.length).toBeGreaterThan(0);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getRegistrySubmissions).toBeDefined();
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
    component.changeSort(RegistrySort.RegisteredOldest);
    expect(component.selectedSortOption()).toBe(RegistrySort.RegisteredOldest);
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
});
