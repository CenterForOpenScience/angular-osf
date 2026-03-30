import { MockComponent, MockPipe } from 'ng-mocks';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAction } from '@osf/features/moderation/models';
import { ReviewsState } from '@osf/features/preprints/enums';
import { PreprintModel, PreprintProviderDetails, PreprintRequestAction } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { StatusBannerComponent } from './status-banner.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

describe('StatusBannerComponent', () => {
  let component: StatusBannerComponent;
  let fixture: ComponentFixture<StatusBannerComponent>;

  const mockPreprint: PreprintModel = PREPRINT_MOCK;
  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockReviewAction: ReviewAction = REVIEW_ACTION_MOCK;
  const mockRequestAction: PreprintRequestAction = REVIEW_ACTION_MOCK as unknown as PreprintRequestAction;

  interface SetupOverrides extends BaseSetupOverrides {
    provider?: PreprintProviderDetails;
    latestAction?: ReviewAction | null;
    latestRequestAction?: PreprintRequestAction | null;
    isPendingWithdrawal?: boolean;
    isWithdrawalRejected?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [StatusBannerComponent, MockComponent(IconComponent), MockPipe(TitleCasePipe)],
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

    fixture = TestBed.createComponent(StatusBannerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', overrides.provider ?? mockProvider);
    fixture.componentRef.setInput(
      'latestAction',
      'latestAction' in overrides ? overrides.latestAction : mockReviewAction
    );
    fixture.componentRef.setInput(
      'latestRequestAction',
      'latestRequestAction' in overrides ? overrides.latestRequestAction : mockRequestAction
    );
    fixture.componentRef.setInput('isPendingWithdrawal', overrides.isPendingWithdrawal ?? false);
    fixture.componentRef.setInput('isWithdrawalRejected', overrides.isWithdrawalRejected ?? false);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should compute pending state severity, status and icon', () => {
    setup();
    expect(component.severity()).toBe('warn');
    expect(component.status()).toBe('preprints.details.statusBanner.pending');
    expect(component.iconClass()).toBe('hourglass');
  });

  it('should compute pending withdrawal state severity, status and icon', () => {
    setup({ isPendingWithdrawal: true });
    expect(component.severity()).toBe('error');
    expect(component.status()).toBe('preprints.details.statusBanner.pendingWithdrawal');
    expect(component.iconClass()).toBe('hourglass');
  });

  it('should compute withdrawal rejected state severity, status and icon', () => {
    setup({ isWithdrawalRejected: true });
    expect(component.severity()).toBe('error');
    expect(component.status()).toBe('preprints.details.statusBanner.withdrawalRejected');
    expect(component.iconClass()).toBe('times-circle');
  });

  it('should treat preprint as withdrawn only when dateWithdrawn is truthy', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintSelectors.getPreprint, value: { ...mockPreprint, dateWithdrawn: undefined } },
      ],
    });
    expect(component.isWithdrawn()).toBe(false);
  });

  it('should compute withdrawn severity/status/icon when dateWithdrawn is set', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintSelectors.getPreprint,
          value: {
            ...mockPreprint,
            reviewsState: ReviewsState.Withdrawn,
            dateWithdrawn: '2024-01-01T00:00:00Z',
          },
        },
      ],
    });
    expect(component.isWithdrawn()).toBe(true);
    expect(component.severity()).toBe('warn');
    expect(component.status()).toBe('preprints.details.statusBanner.withdrawn');
    expect(component.iconClass()).toBe('circle-minus');
  });

  it('should use latest request action reviewer fields when withdrawal is rejected', () => {
    setup({
      isWithdrawalRejected: true,
      latestRequestAction: {
        ...mockRequestAction,
        creator: { id: 'user-2', name: 'Request Reviewer' },
        comment: 'Request action comment',
      },
    });
    expect(component.reviewerName()).toBe('Request Reviewer');
    expect(component.reviewerComment()).toBe('Request action comment');
  });

  it('should use latest action reviewer fields by default', () => {
    setup();
    expect(component.reviewerName()).toBe('Test User');
    expect(component.reviewerComment()).toBe('Initial comment');
  });

  it('should return empty reviewer fields when latest action is missing', () => {
    setup({ latestAction: null });
    expect(component.reviewerName()).toBe('');
    expect(component.reviewerComment()).toBe('');
  });

  it('should return empty reviewer fields when withdrawal is rejected and request action is missing', () => {
    setup({ isWithdrawalRejected: true, latestRequestAction: null });
    expect(component.reviewerName()).toBe('');
    expect(component.reviewerComment()).toBe('');
  });

  it('should build pending banner content with base and workflow message', () => {
    setup();
    const content = component.bannerContent();
    expect(content).toContain('preprints.details.statusBanner.messages.base');
    expect(content).toContain('preprints.details.statusBanner.messages.pendingPreModeration');
  });

  it('should build withdrawal-related banner content without base message', () => {
    setup({ isPendingWithdrawal: true });
    const content = component.bannerContent();
    expect(content).toContain('preprints.details.statusBanner.messages.pendingWithdrawal');
    expect(content).not.toContain('preprints.details.statusBanner.messages.base');
  });

  it('should toggle feedback dialog visibility', () => {
    setup();
    expect(component.feedbackDialogVisible).toBe(false);
    component.showFeedbackDialog();
    expect(component.feedbackDialogVisible).toBe(true);
  });
});
