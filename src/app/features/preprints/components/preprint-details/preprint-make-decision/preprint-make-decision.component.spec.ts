import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import {
  PreprintSelectors,
  SubmitRequestsDecision,
  SubmitReviewsDecision,
} from '@osf/features/preprints/store/preprint';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { PreprintMakeDecisionComponent } from './preprint-make-decision.component';

describe('PreprintMakeDecisionComponent', () => {
  let component: PreprintMakeDecisionComponent;
  let fixture: ComponentFixture<PreprintMakeDecisionComponent>;
  let store: Store;
  let router: Router;
  let routerMock: RouterMockType;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockLatestAction = REVIEW_ACTION_MOCK;
  const mockWithdrawalRequest = PREPRINT_REQUEST_MOCK;

  beforeEach(() => {
    routerMock = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [PreprintMakeDecisionComponent],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        provideMockStore({
          signals: [{ selector: PreprintSelectors.getPreprint, value: mockPreprint }],
        }),
      ],
    });

    fixture = TestBed.createComponent(PreprintMakeDecisionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('latestAction', mockLatestAction);
    fixture.componentRef.setInput('latestWithdrawalRequest', mockWithdrawalRequest);
    fixture.componentRef.setInput('isPendingWithdrawal', false);
  });

  it.each([
    {
      caseName: 'pending preprint',
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Pending },
      isPendingWithdrawal: false,
      expected: 'preprints.details.decision.makeDecision',
    },
    {
      caseName: 'pending withdrawal',
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Accepted },
      isPendingWithdrawal: true,
      expected: 'preprints.details.decision.makeDecision',
    },
  ])('should compute label decision button for $caseName', ({ preprint, isPendingWithdrawal, expected }) => {
    fixture.componentRef.setInput('isPendingWithdrawal', isPendingWithdrawal);
    vi.spyOn(component, 'preprint').mockReturnValue(preprint);
    expect(component.labelDecisionButton()).toBe(expected);
  });

  it('should compute label decision button for withdrawn preprint', () => {
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Withdrawn });
    expect(component.labelDecisionButton()).toBe('preprints.details.decision.withdrawalReason');
  });

  it('should compute make decision button disabled state', () => {
    const disabled = component.makeDecisionButtonDisabled();
    expect(disabled).toBe(false);
  });

  it.each([
    {
      caseName: 'pending preprint',
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Pending },
      isPendingWithdrawal: false,
      expected: 'preprints.details.decision.header.submitDecision',
    },
    {
      caseName: 'pending withdrawal',
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Accepted },
      isPendingWithdrawal: true,
      expected: 'preprints.details.decision.header.submitDecision',
    },
  ])('should compute label decision dialog header for $caseName', ({ preprint, isPendingWithdrawal, expected }) => {
    fixture.componentRef.setInput('isPendingWithdrawal', isPendingWithdrawal);
    vi.spyOn(component, 'preprint').mockReturnValue(preprint);
    expect(component.labelDecisionDialogHeader()).toBe(expected);
  });

  it('should compute label decision dialog header for withdrawn preprint', () => {
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Withdrawn });
    expect(component.labelDecisionDialogHeader()).toBe('preprints.details.decision.header.withdrawalReason');
  });

  it.each([
    {
      workflow: ProviderReviewsWorkflow.PreModeration,
      expected: 'preprints.details.decision.accept.pre',
    },
    {
      workflow: ProviderReviewsWorkflow.PostModeration,
      expected: 'preprints.details.decision.accept.post',
    },
  ])('should compute accept option explanation for workflow %s', ({ workflow, expected }) => {
    fixture.componentRef.setInput('provider', { ...mockProvider, reviewsWorkflow: workflow });
    expect(component.acceptOptionExplanation()).toBe(expected);
  });

  it('should compute reject option label for unpublished preprint', () => {
    const label = component.rejectOptionLabel();
    expect(label).toBe('preprints.details.decision.reject.label');
  });

  it('should compute basic derived settings and state flags', () => {
    expect(component.settingsComments()).toBeDefined();
    expect(component.settingsNames()).toBeDefined();
    expect(component.settingsModeration()).toBeDefined();
    expect(typeof component.commentEdited()).toBe('boolean');
    expect(typeof component.commentExceedsLimit()).toBe('boolean');
    expect(typeof component.decisionChanged()).toBe('boolean');
  });

  it('should return true when reviewer comment exceeds decision comment limit', () => {
    component.reviewerComment.set('a'.repeat(component.decisionCommentLimit + 1));
    expect(component.commentExceedsLimit()).toBe(true);
  });

  it('should have initial signal values', () => {
    expect(component.dialogVisible).toBe(false);
    expect(component.didValidate()).toBe(false);
    expect(component.decision()).toBe(ReviewsState.Accepted);
    expect(component.saving()).toBe(false);
  });

  it('should initialize decision and comments for pending preprint in constructor effect', () => {
    fixture.componentRef.setInput('latestAction', { ...mockLatestAction, comment: 'Latest decision comment' });
    expect(component.decision()).toBe(ReviewsState.Accepted);
    expect(component.initialReviewerComment()).toBeNull();
    expect(component.reviewerComment()).toBeNull();
  });

  it('should initialize decision and comments for non-pending preprint in constructor effect', () => {
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Rejected });
    fixture.componentRef.setInput('latestAction', { ...mockLatestAction, comment: 'Updated moderator comment' });
    fixture.detectChanges();
    expect(component.decision()).toBe(ReviewsState.Rejected);
    expect(component.initialReviewerComment()).toBe('Updated moderator comment');
    expect(component.reviewerComment()).toBe('Updated moderator comment');
  });

  it('should return early in constructor effect when preprint is missing', () => {
    component.decision.set(ReviewsState.Withdrawn);
    component.initialReviewerComment.set('Initial');
    component.reviewerComment.set('Current');
    vi.spyOn(component, 'preprint').mockReturnValue(null);
    fixture.componentRef.setInput('latestAction', { ...mockLatestAction, comment: 'Ignored comment' });
    expect(component.decision()).toBe(ReviewsState.Withdrawn);
    expect(component.initialReviewerComment()).toBe('Initial');
    expect(component.reviewerComment()).toBe('Current');
  });

  it('should keep existing values when constructor effect receives null preprint', () => {
    component.decision.set(ReviewsState.Rejected);
    component.initialReviewerComment.set('Initial value');
    component.reviewerComment.set('Current value');
    vi.spyOn(component, 'preprint').mockReturnValue(null);

    fixture.componentRef.setInput('latestAction', { ...mockLatestAction, comment: 'Should not apply' });

    expect(component.decision()).toBe(ReviewsState.Rejected);
    expect(component.initialReviewerComment()).toBe('Initial value');
    expect(component.reviewerComment()).toBe('Current value');
  });

  it('should set request decision justification from latest withdrawal request in constructor effect', () => {
    component.requestDecisionJustification.set(null);
    fixture.componentRef.setInput('latestWithdrawalRequest', {
      ...mockWithdrawalRequest,
      comment: 'Withdrawal reason',
    });
    fixture.detectChanges();
    expect(component.requestDecisionJustification()).toBe('Withdrawal reason');
  });

  it('should not set request decision justification when latest withdrawal request is missing', () => {
    component.requestDecisionJustification.set('Existing value');
    fixture.componentRef.setInput('latestWithdrawalRequest', null);
    expect(component.requestDecisionJustification()).toBe('Existing value');
  });

  it('should keep existing justification when constructor effect receives null withdrawal request', () => {
    component.requestDecisionJustification.set('Persisted justification');

    fixture.componentRef.setInput('latestWithdrawalRequest', null);

    expect(component.requestDecisionJustification()).toBe('Persisted justification');
  });

  it('should set justification from latest withdrawal request when toggled to accepted', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    component.decision.set(ReviewsState.Accepted);
    component.requestDecisionJustification.set(null);

    component.requestDecisionToggled();

    expect(component.requestDecisionJustification()).toBe(mockWithdrawalRequest.comment);
  });

  it('should clear justification when toggled to rejected', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    component.requestDecisionJustification.set('Some justification');
    component.decision.set(ReviewsState.Rejected);

    component.requestDecisionToggled();

    expect(component.requestDecisionJustification()).toBeNull();
  });

  it('should reset local dialog state on cancel', () => {
    component.dialogVisible = true;
    component.decision.set(ReviewsState.Rejected);
    component.initialReviewerComment.set('Initial');
    component.reviewerComment.set('Changed');

    component.cancel();

    expect(component.dialogVisible).toBe(false);
    expect(component.decision()).toBe(mockPreprint.reviewsState);
    expect(component.reviewerComment()).toBe('Initial');
  });

  it('should compute label submit button when decision changed', () => {
    vi.spyOn(component, 'isPendingWithdrawal').mockReturnValue(false);
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    vi.spyOn(component, 'decisionChanged').mockReturnValue(true);
    vi.spyOn(component, 'commentEdited').mockReturnValue(false);
    const label = component.labelSubmitButton();
    expect(label).toBe('preprints.details.decision.submitButton.modifyDecision');
  });

  it('should compute label submit button when comment edited', () => {
    vi.spyOn(component, 'isPendingWithdrawal').mockReturnValue(false);
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    vi.spyOn(component, 'decisionChanged').mockReturnValue(false);
    vi.spyOn(component, 'commentEdited').mockReturnValue(true);
    const label = component.labelSubmitButton();
    expect(label).toBe('preprints.details.decision.submitButton.updateComment');
  });

  it('should compute label submit button as submit decision for pending withdrawal', () => {
    vi.spyOn(component, 'isPendingWithdrawal').mockReturnValue(true);
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    expect(component.labelSubmitButton()).toBe('preprints.details.decision.submitButton.submitDecision');
  });

  it('should compute submit button disabled when neither decision changed nor comment edited', () => {
    vi.spyOn(component, 'decisionChanged').mockReturnValue(false);
    vi.spyOn(component, 'commentEdited').mockReturnValue(false);
    const disabled = component.submitButtonDisabled();
    expect(disabled).toBe(true);
  });

  it('should compute label request decision justification for accepted decision', () => {
    component.decision.set(ReviewsState.Accepted);
    const label = component.labelRequestDecisionJustification();
    expect(label).toBe('preprints.details.decision.withdrawalJustification');
  });

  it('should compute label request decision justification for rejected decision', () => {
    component.decision.set(ReviewsState.Rejected);
    const label = component.labelRequestDecisionJustification();
    expect(label).toBe('preprints.details.decision.denialJustification');
  });

  it('should compute reject option explanation for pre-moderation with accepted preprint', () => {
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    const explanation = component.rejectOptionExplanation();
    expect(explanation).toBe('preprints.details.decision.approve.explanation');
  });

  it('should compute reject option explanation for post-moderation', () => {
    const postModerationProvider = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration };
    fixture.componentRef.setInput('provider', postModerationProvider);
    const explanation = component.rejectOptionExplanation();
    expect(explanation).toBeDefined();
  });

  it('should fallback reject option explanation when workflow is null', () => {
    fixture.componentRef.setInput('provider', { ...mockProvider, reviewsWorkflow: null });
    const explanation = component.rejectOptionExplanation();
    expect(explanation).toBe('preprints.details.decision.withdrawn.post');
  });

  it('should compute reject radio button value for published preprint', () => {
    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, isPublished: true });
    const value = component.rejectRadioButtonValue();
    expect(value).toBe(ReviewsState.Withdrawn);
  });

  it('should handle submit method', () => {
    (store.dispatch as Mock).mockClear();
    expect(() => component.submit()).not.toThrow();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not submit when preprint is missing', () => {
    (store.dispatch as Mock).mockClear();
    vi.spyOn(component, 'preprint').mockReturnValue(null);
    component.submit();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
  });

  it('should validate withdrawal rejection justification with trim-aware required check', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    component.decision.set(ReviewsState.Rejected);
    component.requestDecisionJustification.set('   ');
    (store.dispatch as Mock).mockClear();

    component.submit();

    expect(component.didValidate()).toBe(true);
    expect(component.requestDecisionJustificationErrorMessage()).toBe(
      'preprints.details.decision.justificationRequiredError'
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return justification min-length error when justification is too short', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    component.decision.set(ReviewsState.Rejected);
    component.requestDecisionJustification.set('a');
    expect(component.requestDecisionJustificationErrorMessage()).toBe(
      'preprints.details.decision.justificationLengthError'
    );
  });

  it('should submit pending withdrawal decision and navigate to withdrawals', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    fixture.componentRef.setInput('latestWithdrawalRequest', { ...mockWithdrawalRequest, id: 'request-123' });
    component.decision.set(ReviewsState.Accepted);
    component.requestDecisionJustification.set('  valid justification  ');
    (store.dispatch as Mock).mockClear();

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new SubmitRequestsDecision('request-123', 'accept', 'valid justification')
    );
    expect(navigateSpy).toHaveBeenCalledWith(['preprints', mockProvider.id, 'moderation', 'withdrawals']);
    expect(component.saving()).toBe(false);
  });

  it('should submit edit_comment trigger when only comment changed on non-pending decision', () => {
    vi.spyOn(component, 'preprint').mockReturnValue({
      ...mockPreprint,
      reviewsState: ReviewsState.Accepted,
      isPublished: false,
    });
    fixture.componentRef.setInput('isPendingWithdrawal', false);
    component.decision.set(ReviewsState.Accepted);
    component.initialReviewerComment.set('Old comment');
    component.reviewerComment.set('New comment');
    (store.dispatch as Mock).mockClear();

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(new SubmitReviewsDecision('edit_comment', 'New comment'));
  });

  it('should submit reject trigger for published preprint with pending withdrawal and rejected decision', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    fixture.componentRef.setInput('latestWithdrawalRequest', { ...mockWithdrawalRequest, id: 'request-456' });
    vi.spyOn(component, 'preprint').mockReturnValue({
      ...mockPreprint,
      reviewsState: ReviewsState.Accepted,
      isPublished: true,
    });
    component.decision.set(ReviewsState.Rejected);
    component.requestDecisionJustification.set('Valid rejection reason');
    (store.dispatch as Mock).mockClear();

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new SubmitRequestsDecision('request-456', 'reject', 'Valid rejection reason')
    );
  });

  it('should submit withdraw trigger for published preprint without pending withdrawal and rejected decision', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', false);
    vi.spyOn(component, 'preprint').mockReturnValue({
      ...mockPreprint,
      reviewsState: ReviewsState.Accepted,
      isPublished: true,
    });
    component.decision.set(ReviewsState.Rejected);
    component.initialReviewerComment.set('Original');
    component.reviewerComment.set('Updated rejection note');
    (store.dispatch as Mock).mockClear();

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(new SubmitReviewsDecision('withdraw', 'Updated rejection note'));
  });

  it('should not dispatch pending-withdrawal decision when latest withdrawal request is missing', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    fixture.componentRef.setInput('latestWithdrawalRequest', null);
    component.decision.set(ReviewsState.Accepted);
    component.requestDecisionJustification.set('Valid justification');
    (store.dispatch as Mock).mockClear();

    component.submit();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
  });

  it('should not reset decision in cancel when preprint is missing', () => {
    component.decision.set(ReviewsState.Rejected);
    component.initialReviewerComment.set('Initial');
    component.reviewerComment.set('Changed');
    vi.spyOn(component, 'preprint').mockReturnValue(null);

    component.cancel();

    expect(component.decision()).toBe(ReviewsState.Rejected);
    expect(component.reviewerComment()).toBe('Initial');
  });

  it('should return early in requestDecisionToggled when not pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', false);
    component.decision.set(ReviewsState.Rejected);
    component.requestDecisionJustification.set('Existing value');
    component.requestDecisionToggled();
    expect(component.requestDecisionJustification()).toBe('Existing value');
  });
});
