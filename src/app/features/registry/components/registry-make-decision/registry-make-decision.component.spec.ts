import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationDecisionFormControls } from '@osf/shared/enums/moderation-decision-form-controls.enum';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { ReviewActionTrigger, SchemaResponseActionTrigger } from '@osf/shared/enums/trigger-action.enum';
import { DateAgoPipe } from '@shared/pipes/date-ago.pipe';

import { RegistrySelectors } from '../../store/registry';

import { RegistryMakeDecisionComponent } from './registry-make-decision.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryMakeDecisionComponent', () => {
  let component: RegistryMakeDecisionComponent;
  let fixture: ComponentFixture<RegistryMakeDecisionComponent>;
  let mockDialogRef: jest.Mocked<DynamicDialogRef>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  const mockRegistry = {
    ...MOCK_REGISTRATION_OVERVIEW_MODEL,
    reviewsState: RegistrationReviewStates.Accepted,
    revisionState: RevisionReviewStates.Approved,
  };

  beforeEach(async () => {
    mockDialogRef = DynamicDialogRefMock.useValue as unknown as jest.Mocked<DynamicDialogRef>;

    mockDialogConfig = {
      data: {
        registry: mockRegistry,
        revisionId: 'test-revision-id',
      },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [RegistryMakeDecisionComponent, OSFTestingModule, MockPipe(DateAgoPipe)],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({
          signals: [
            { selector: RegistrySelectors.getReviewActions, value: [] },
            { selector: RegistrySelectors.isReviewActionSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.requestForm.get(ModerationDecisionFormControls.Action)?.value).toBe('');
    expect(component.requestForm.get(ModerationDecisionFormControls.Comment)?.value).toBe('');
  });

  it('should compute isPendingReview correctly', () => {
    expect(component.isPendingReview).toBe(false);

    mockDialogConfig.data.registry = { ...mockRegistry, reviewsState: RegistrationReviewStates.Pending };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isPendingReview).toBe(true);
  });

  it('should compute isPendingWithdrawal correctly', () => {
    expect(component.isPendingWithdrawal).toBe(false);

    mockDialogConfig.data.registry = { ...mockRegistry, reviewsState: RegistrationReviewStates.PendingWithdraw };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isPendingWithdrawal).toBe(true);
  });

  it('should compute canWithdraw correctly', () => {
    expect(component.canWithdraw).toBe(true);

    mockDialogConfig.data.registry = {
      ...mockRegistry,
      reviewsState: RegistrationReviewStates.Pending,
      revisionStatus: RevisionReviewStates.RevisionInProgress,
    };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.canWithdraw).toBe(false);
  });

  it('should compute acceptValue correctly for pending review', () => {
    mockDialogConfig.data.registry = { ...mockRegistry, reviewsState: RegistrationReviewStates.Pending };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.acceptValue).toBe(ReviewActionTrigger.AcceptSubmission);
  });

  it('should compute rejectValue correctly for pending review', () => {
    mockDialogConfig.data.registry = { ...mockRegistry, reviewsState: RegistrationReviewStates.Pending };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.rejectValue).toBe(ReviewActionTrigger.RejectSubmission);
  });

  it('should compute rejectValue correctly for pending withdrawal', () => {
    mockDialogConfig.data.registry = { ...mockRegistry, reviewsState: RegistrationReviewStates.PendingWithdraw };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.rejectValue).toBe(ReviewActionTrigger.RejectWithdrawal);
  });

  it('should handle form submission', () => {
    const submitDecisionSpy = jest.fn().mockReturnValue(of({}));
    const closeSpy = jest.spyOn(mockDialogRef, 'close');
    component.actions = {
      ...component.actions,
      submitDecision: submitDecisionSpy,
    };

    const formValue = {
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
      [ModerationDecisionFormControls.Comment]: 'Test comment',
    };

    component.requestForm.patchValue(formValue);

    component.handleSubmission();

    expect(submitDecisionSpy).toHaveBeenCalledWith(
      {
        targetId: 'test-revision-id',
        action: ReviewActionTrigger.AcceptSubmission,
        comment: 'Test comment',
      },
      true
    );
    expect(closeSpy).toHaveBeenCalledWith(formValue);
  });

  it('should handle form submission without revision ID', () => {
    mockDialogConfig.data.revisionId = undefined;
    const submitDecisionSpy = jest.fn().mockReturnValue(of({}));
    component.actions = {
      ...component.actions,
      submitDecision: submitDecisionSpy,
    };

    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
      [ModerationDecisionFormControls.Comment]: 'Test comment',
    });

    component.handleSubmission();

    expect(submitDecisionSpy).toHaveBeenCalledWith(
      {
        targetId: 'test-registry-id',
        action: ReviewActionTrigger.AcceptSubmission,
        comment: 'Test comment',
      },
      false
    );
  });

  it('should update comment validators when action changes', () => {
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission,
    });
    expect(commentControl?.hasError('required')).toBe(true);
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
    });

    expect(commentControl?.hasError('required')).toBe(false);
  });

  it('should handle form validation state', () => {
    expect(component.requestForm.valid).toBe(false);

    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
    });

    expect(component.requestForm.valid).toBe(true);
  });

  it('should handle different registry states', () => {
    const states = [
      { reviewsState: RegistrationReviewStates.Pending, revisionState: RevisionReviewStates.Approved },
      { reviewsState: RegistrationReviewStates.Accepted, revisionState: RevisionReviewStates.Approved },
      { reviewsState: RegistrationReviewStates.PendingWithdraw, revisionState: RevisionReviewStates.Approved },
    ];

    states.forEach((state) => {
      mockDialogConfig.data.registry = { ...mockRegistry, ...state };

      fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.registry.reviewsState).toBe(state.reviewsState);
      expect(component.registry.revisionState).toBe(state.revisionState);
    });
  });

  it('should identify comment as required for reject actions', () => {
    expect(component.isCommentRequired(ReviewActionTrigger.RejectSubmission)).toBe(true);
    expect(component.isCommentRequired(SchemaResponseActionTrigger.RejectRevision)).toBe(true);
    expect(component.isCommentRequired(ReviewActionTrigger.RejectWithdrawal)).toBe(true);
    expect(component.isCommentRequired(ReviewActionTrigger.ForceWithdraw)).toBe(true);
  });

  it('should compute isCommentInvalid correctly when comment is required and empty', () => {
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission,
      [ModerationDecisionFormControls.Comment]: '',
    });
    commentControl?.markAsTouched();

    expect(component.isCommentInvalid).toBe(true);
  });

  it('should compute isCommentInvalid as false when control is not touched or dirty', () => {
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission,
      [ModerationDecisionFormControls.Comment]: '',
    });

    expect(component.isCommentInvalid).toBe(false);
  });

  it('should validate comment max length', () => {
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);
    const longComment = 'a'.repeat(component.decisionCommentLimit + 1);
    commentControl?.setValue(longComment);
    commentControl?.updateValueAndValidity();

    expect(commentControl?.hasError('maxlength')).toBe(true);
  });

  it('should update comment validators when action changes to reject', () => {
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission,
    });

    expect(commentControl?.hasError('required')).toBe(true);
  });

  it('should clear comment validators when action changes to accept', () => {
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission,
    });
    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
    });

    expect(commentControl?.hasError('required')).toBe(false);
  });

  it('should initialize with correct constants', () => {
    expect(component.decisionCommentLimit).toBeDefined();
    expect(component.INPUT_VALIDATION_MESSAGES).toBeDefined();
    expect(component.ReviewActionTrigger).toBeDefined();
    expect(component.SchemaResponseActionTrigger).toBeDefined();
    expect(component.ModerationDecisionFormControls).toBeDefined();
  });

  it('should set embargoEndDate from registry', () => {
    const testDate = '2024-12-31';
    mockDialogConfig.data.registry = { ...mockRegistry, embargoEndDate: testDate };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.embargoEndDate).toBe(testDate);
  });
});
