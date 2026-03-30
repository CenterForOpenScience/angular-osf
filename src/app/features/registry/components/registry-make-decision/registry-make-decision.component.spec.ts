import { Store } from '@ngxs/store';

import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { ModerationDecisionFormControls } from '@osf/shared/enums/moderation-decision-form-controls.enum';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { ReviewActionTrigger, SchemaResponseActionTrigger } from '@osf/shared/enums/trigger-action.enum';
import { DateAgoPipe } from '@osf/shared/pipes/date-ago.pipe';

import { RegistrySelectors } from '../../store/registry';

import { RegistryMakeDecisionComponent } from './registry-make-decision.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_REGISTRY_ACCEPTED = {
  ...MOCK_REGISTRATION_OVERVIEW_MODEL,
  reviewsState: RegistrationReviewStates.Accepted,
  revisionState: RevisionReviewStates.Approved,
};

interface SetupOverrides {
  registry?: typeof MOCK_REGISTRY_ACCEPTED;
  revisionId?: string;
}

function setup(overrides: SetupOverrides = {}) {
  const registry = overrides.registry ?? MOCK_REGISTRY_ACCEPTED;
  const revisionId = 'revisionId' in overrides ? overrides.revisionId : 'test-revision-id';

  TestBed.configureTestingModule({
    imports: [RegistryMakeDecisionComponent, MockPipe(DateAgoPipe)],
    providers: [
      provideOSFCore(),
      provideDynamicDialogRefMock(),
      MockProvider(DynamicDialogConfig, { data: { registry, revisionId } }),
      provideMockStore({
        signals: [
          { selector: RegistrySelectors.getReviewActions, value: [] },
          { selector: RegistrySelectors.isReviewActionSubmitting, value: false },
        ],
      }),
    ],
  });

  const store = TestBed.inject(Store);
  const dialogRef = TestBed.inject(DynamicDialogRef);
  const fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, store, dialogRef };
}

describe('RegistryMakeDecisionComponent', () => {
  it('should create with default accepted/approved state', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.isPendingReview).toBe(false);
    expect(component.isPendingWithdrawal).toBe(false);
    expect(component.canWithdraw).toBe(true);
  });

  it('should compute pending review properties', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRY_ACCEPTED, reviewsState: RegistrationReviewStates.Pending },
    });

    expect(component.isPendingReview).toBe(true);
    expect(component.acceptValue).toBe(ReviewActionTrigger.AcceptSubmission);
    expect(component.rejectValue).toBe(ReviewActionTrigger.RejectSubmission);
  });

  it('should compute pending withdrawal properties', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRY_ACCEPTED, reviewsState: RegistrationReviewStates.PendingWithdraw },
    });

    expect(component.isPendingWithdrawal).toBe(true);
    expect(component.acceptValue).toBe(ReviewActionTrigger.AcceptWithdrawal);
    expect(component.rejectValue).toBe(ReviewActionTrigger.RejectWithdrawal);
  });

  it('should compute revision accept/reject values for non-pending states', () => {
    const { component } = setup({
      registry: {
        ...MOCK_REGISTRY_ACCEPTED,
        revisionState: RevisionReviewStates.RevisionPendingModeration,
      },
    });

    expect(component.isPendingModeration).toBe(true);
    expect(component.acceptValue).toBe(SchemaResponseActionTrigger.AcceptRevision);
    expect(component.rejectValue).toBe(SchemaResponseActionTrigger.RejectRevision);
  });

  it('should set embargoEndDate from registry', () => {
    const { component } = setup({
      registry: { ...MOCK_REGISTRY_ACCEPTED, embargoEndDate: '2024-12-31' },
    });

    expect(component.embargoEndDate).toBe('2024-12-31');
  });

  it('should add required validator when action changes to reject', () => {
    const { component } = setup();
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);

    component.requestForm.patchValue({ [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission });

    expect(commentControl?.hasError('required')).toBe(true);
  });

  it('should clear required validator when action changes to accept', () => {
    const { component } = setup();
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);

    component.requestForm.patchValue({ [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission });
    component.requestForm.patchValue({ [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission });

    expect(commentControl?.hasError('required')).toBe(false);
  });

  it('should compute isCommentInvalid when comment is required, empty and touched', () => {
    const { component } = setup();
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);

    component.requestForm.patchValue({ [ModerationDecisionFormControls.Action]: ReviewActionTrigger.RejectSubmission });
    commentControl?.markAsTouched();

    expect(component.isCommentInvalid).toBe(true);
  });

  it('should identify comment as required for all reject/force actions', () => {
    const { component } = setup();

    expect(component.isCommentRequired(ReviewActionTrigger.RejectSubmission)).toBe(true);
    expect(component.isCommentRequired(SchemaResponseActionTrigger.RejectRevision)).toBe(true);
    expect(component.isCommentRequired(ReviewActionTrigger.RejectWithdrawal)).toBe(true);
    expect(component.isCommentRequired(ReviewActionTrigger.ForceWithdraw)).toBe(true);
    expect(component.isCommentRequired(ReviewActionTrigger.AcceptSubmission)).toBe(false);
  });

  it('should dispatch and close dialog on successful submission with revisionId', () => {
    const { component, store, dialogRef } = setup();
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
      [ModerationDecisionFormControls.Comment]: 'Test comment',
    });
    component.handleSubmission();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          targetId: 'test-revision-id',
          action: ReviewActionTrigger.AcceptSubmission,
        }),
        isRevision: true,
      })
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should use registry id as targetId when revisionId is absent', () => {
    const { component, store } = setup({ revisionId: undefined });
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
      [ModerationDecisionFormControls.Comment]: '',
    });
    component.handleSubmission();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ targetId: 'test-registry-id' }),
        isRevision: false,
      })
    );
  });

  it('should not close dialog on submission error', () => {
    const { component, store, dialogRef } = setup();
    jest.spyOn(store, 'dispatch').mockReturnValue(throwError(() => new Error()));

    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
      [ModerationDecisionFormControls.Comment]: '',
    });
    component.handleSubmission();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
