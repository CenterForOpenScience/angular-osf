import { MockComponent, MockPipes } from 'ng-mocks';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAction } from '@osf/features/moderation/models';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails, PreprintRequest } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { ModerationStatusBannerComponent } from './moderation-status-banner.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

describe('ModerationStatusBannerComponent', () => {
  let component: ModerationStatusBannerComponent;
  let fixture: ComponentFixture<ModerationStatusBannerComponent>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockReviewAction = REVIEW_ACTION_MOCK;
  const mockWithdrawalRequest = PREPRINT_REQUEST_MOCK;

  interface SetupOverrides extends BaseSetupOverrides {
    provider?: PreprintProviderDetails | undefined;
    latestAction?: ReviewAction | null;
    latestWithdrawalRequest?: PreprintRequest | null;
    isPendingWithdrawal?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [ModerationStatusBannerComponent, MockComponent(IconComponent), ...MockPipes(TitleCasePipe, DatePipe)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: mergeSignalOverrides(
            [{ selector: PreprintSelectors.getPreprint, value: mockPreprint }],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(ModerationStatusBannerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', 'provider' in overrides ? overrides.provider : mockProvider);
    fixture.componentRef.setInput(
      'latestAction',
      'latestAction' in overrides ? overrides.latestAction : mockReviewAction
    );
    fixture.componentRef.setInput(
      'latestWithdrawalRequest',
      'latestWithdrawalRequest' in overrides ? overrides.latestWithdrawalRequest : mockWithdrawalRequest
    );
    fixture.componentRef.setInput('isPendingWithdrawal', overrides.isPendingWithdrawal ?? false);
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose store preprint and provider-based document type', () => {
    setup();
    expect(component.preprint()).toBe(mockPreprint);
    expect(component.documentType()?.singular).toBeDefined();
  });

  it('should return null documentType when provider is missing', () => {
    setup({ provider: undefined });
    expect(component.documentType()).toBeNull();
  });

  it('should compute currentState and fallback to pending when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintSelectors.getPreprint, value: undefined }],
    });
    expect(component.currentState()).toBe(ReviewsState.Pending);
  });

  it('should compute labelDate using dateLastTransitioned and prefer dateWithdrawn when present', () => {
    setup();
    expect(component.labelDate()).toBe(mockPreprint.dateLastTransitioned);

    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: { ...mockPreprint, dateWithdrawn: '2024-01-01T00:00:00Z' },
        },
      ],
    });
    expect(component.labelDate()).toBe('2024-01-01T00:00:00Z');
  });

  it('should compute status, icon and severity for pending withdrawal', () => {
    setup({ isPendingWithdrawal: true });
    expect(component.status()).toBe('preprints.details.statusBanner.pending');
    expect(component.iconClass()).toBe('hourglass');
    expect(component.severity()).toBe('warn');
  });

  it('should compute status, icon and severity from non-pending current state', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: { ...mockPreprint, reviewsState: ReviewsState.Accepted },
        },
      ],
    });
    expect(component.status()).toBe('preprints.details.statusBanner.accepted');
    expect(component.iconClass()).toBe('check-circle');
    expect(component.severity()).toBe('success');
  });

  it('should compute severity for pending preprint based on provider workflow', () => {
    setup({
      provider: { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration },
    });
    expect(component.severity()).toBe('secondary');
  });

  it('should compute recent activity language for automatic and action-based paths', () => {
    setup({ latestAction: null });
    expect(component.noActions()).toBe(true);
    expect(component.recentActivityLanguage()).toBe(
      'preprints.details.moderationStatusBanner.recentActivity.automatic.pending'
    );

    setup();
    expect(component.noActions()).toBe(false);
    expect(component.recentActivityLanguage()).toBe('preprints.details.moderationStatusBanner.recentActivity.pending');
  });

  it('should compute request activity language only for pending withdrawal', () => {
    setup();
    expect(component.requestActivityLanguage()).toBeUndefined();

    setup({ isPendingWithdrawal: true });
    expect(component.requestActivityLanguage()).toBe(
      'preprints.details.moderationStatusBanner.recentActivity.pendingWithdrawal'
    );
  });

  it('should compute action creator fields and nullable action creator link', () => {
    setup();
    expect(component.actionCreatorName()).toBe('Test User');
    expect(component.actionCreatorId()).toBe('user-1');
    expect(component.actionCreatorLink()).toBe(`${component.webUrl}/user-1`);

    setup({ latestAction: null });
    expect(component.actionCreatorLink()).toBeNull();
  });

  it('should compute withdrawal requester fields and nullable requester link', () => {
    setup();
    expect(component.withdrawalRequesterName()).toBe('John Doe');
    expect(component.withdrawalRequesterId()).toBe('user-123');
    expect(component.withdrawalRequesterLink()).toBe(`${component.webUrl}/user-123`);

    setup({ latestWithdrawalRequest: null });
    expect(component.withdrawalRequesterLink()).toBeNull();
  });
});
