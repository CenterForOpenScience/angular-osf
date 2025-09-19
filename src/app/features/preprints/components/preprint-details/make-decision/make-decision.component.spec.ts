import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAction } from '@osf/features/moderation/models';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails, PreprintRequest } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';

import { MakeDecisionComponent } from './make-decision.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MakeDecisionComponent', () => {
  let component: MakeDecisionComponent;
  let fixture: ComponentFixture<MakeDecisionComponent>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockLatestAction: ReviewAction = REVIEW_ACTION_MOCK;
  const mockWithdrawalRequest: PreprintRequest = PREPRINT_REQUEST_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeDecisionComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDecisionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('latestAction', mockLatestAction);
    fixture.componentRef.setInput('latestWithdrawalRequest', mockWithdrawalRequest);
    fixture.componentRef.setInput('isPendingWithdrawal', false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should compute label decision button for pending preprint', () => {
    const label = component.labelDecisionButton();
    expect(label).toBe('preprints.details.decision.makeDecision');
  });

  it('should compute make decision button disabled state', () => {
    const disabled = component.makeDecisionButtonDisabled();
    expect(disabled).toBe(false);
  });

  it('should compute label decision dialog header for pending preprint', () => {
    const header = component.labelDecisionDialogHeader();
    expect(header).toBe('preprints.details.decision.header.submitDecision');
  });

  it('should compute label submit button for pending preprint', () => {
    const label = component.labelSubmitButton();
    expect(label).toBe('preprints.details.decision.submitButton.submitDecision');
  });

  it('should compute accept option explanation for pre-moderation', () => {
    const explanation = component.acceptOptionExplanation();
    expect(explanation).toBe('preprints.details.decision.accept.pre');
  });

  it('should compute reject option label for unpublished preprint', () => {
    const label = component.rejectOptionLabel();
    expect(label).toBe('preprints.details.decision.reject.label');
  });

  it('should compute settings comments for private comments', () => {
    const settings = component.settingsComments();
    expect(settings).toBeDefined();
  });

  it('should compute settings names for named comments', () => {
    const settings = component.settingsNames();
    expect(settings).toBeDefined();
  });

  it('should compute settings moderation for pre-moderation workflow', () => {
    const settings = component.settingsModeration();
    expect(settings).toBeDefined();
  });

  it('should compute comment edited state', () => {
    const edited = component.commentEdited();
    expect(typeof edited).toBe('boolean');
  });

  it('should compute comment exceeds limit state', () => {
    const exceeds = component.commentExceedsLimit();
    expect(typeof exceeds).toBe('boolean');
  });

  it('should compute decision changed state', () => {
    const changed = component.decisionChanged();
    expect(typeof changed).toBe('boolean');
  });

  it('should have initial signal values', () => {
    expect(component.dialogVisible).toBe(false);
    expect(component.didValidate()).toBe(false);
    expect(component.decision()).toBe(ReviewsState.Accepted);
    expect(component.saving()).toBe(false);
  });

  it('should handle request decision toggled', () => {
    expect(() => component.requestDecisionToggled()).not.toThrow();
  });

  it('should handle cancel', () => {
    expect(() => component.cancel()).not.toThrow();
  });

  it('should compute label submit button when decision changed', () => {
    jest.spyOn(component, 'isPendingWithdrawal').mockReturnValue(false);
    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    jest.spyOn(component, 'decisionChanged').mockReturnValue(true);
    jest.spyOn(component, 'commentEdited').mockReturnValue(false);
    const label = component.labelSubmitButton();
    expect(label).toBe('preprints.details.decision.submitButton.modifyDecision');
  });

  it('should compute label submit button when comment edited', () => {
    jest.spyOn(component, 'isPendingWithdrawal').mockReturnValue(false);
    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    jest.spyOn(component, 'decisionChanged').mockReturnValue(false);
    jest.spyOn(component, 'commentEdited').mockReturnValue(true);
    const label = component.labelSubmitButton();
    expect(label).toBe('preprints.details.decision.submitButton.updateComment');
  });

  it('should compute submit button disabled when neither decision changed nor comment edited', () => {
    jest.spyOn(component, 'decisionChanged').mockReturnValue(false);
    jest.spyOn(component, 'commentEdited').mockReturnValue(false);
    const disabled = component.submitButtonDisabled();
    expect(disabled).toBe(true);
  });

  it('should compute accept option explanation for post-moderation', () => {
    const postModerationProvider = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration };
    fixture.componentRef.setInput('provider', postModerationProvider);
    const explanation = component.acceptOptionExplanation();
    expect(explanation).toBe('preprints.details.decision.accept.post');
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
    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, reviewsState: ReviewsState.Accepted });
    const explanation = component.rejectOptionExplanation();
    expect(explanation).toBe('preprints.details.decision.approve.explanation');
  });

  it('should compute reject option explanation for post-moderation', () => {
    const postModerationProvider = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration };
    fixture.componentRef.setInput('provider', postModerationProvider);
    const explanation = component.rejectOptionExplanation();
    expect(explanation).toBeDefined();
  });

  it('should compute reject radio button value for published preprint', () => {
    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, isPublished: true });
    const value = component.rejectRadioButtonValue();
    expect(value).toBe(ReviewsState.Withdrawn);
  });

  it('should handle submit method', () => {
    expect(() => component.submit()).not.toThrow();
  });
});
