import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationType, SubmissionReviewStatus } from '@osf/features/moderation/enums';
import { CollectionsModerationSelectors } from '@osf/features/moderation/store/collections-moderation';
import { ModerationDecisionFormControls } from '@osf/shared/enums/moderation-decision-form-controls.enum';
import { ModerationSubmitType } from '@osf/shared/enums/moderation-submit-type.enum';
import { CollectionsSelectors } from '@osf/shared/stores/collections';

import { MakeDecisionDialogComponent } from './make-decision-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MakeDecisionDialogComponent', () => {
  let component: MakeDecisionDialogComponent;
  let fixture: ComponentFixture<MakeDecisionDialogComponent>;
  let mockDialogRef: Partial<DynamicDialogRef>;
  let mockConfig: Partial<DynamicDialogConfig>;

  const mockCollectionProvider = {
    id: 'provider-1',
    reviewsWorkflow: ModerationType.Hybrid,
  };

  const mockReviewAction = {
    targetId: 'submission-123',
    toState: SubmissionReviewStatus.Pending,
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    mockConfig = {
      data: {},
    };

    await TestBed.configureTestingModule({
      imports: [MakeDecisionDialogComponent, OSFTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getCollectionProvider, value: signal(mockCollectionProvider) },
            { selector: CollectionsModerationSelectors.getCurrentReviewAction, value: signal(mockReviewAction) },
            { selector: CollectionsModerationSelectors.getCollectionSubmissionSubmitting, value: signal(false) },
          ],
        }),
        MockProvider(DynamicDialogRef, mockDialogRef),
        MockProvider(DynamicDialogConfig, mockConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDecisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose enums', () => {
    expect(component.ModerationSubmitType).toBe(ModerationSubmitType);
    expect(component.SubmissionReviewStatus).toBe(SubmissionReviewStatus);
    expect(component.ModerationDecisionFormControls).toBe(ModerationDecisionFormControls);
  });

  it('should initialize form with action and comment controls', () => {
    expect(component.requestForm).toBeDefined();
    expect(component.requestForm.get(ModerationDecisionFormControls.Action)).toBeDefined();
    expect(component.requestForm.get(ModerationDecisionFormControls.Comment)).toBeDefined();
  });

  it('should have action control required', () => {
    const actionControl = component.requestForm.get(ModerationDecisionFormControls.Action);
    expect(actionControl?.hasError('required')).toBe(true);
  });

  it('should have comment control optional', () => {
    const commentControl = component.requestForm.get(ModerationDecisionFormControls.Comment);
    expect(commentControl?.hasError('required')).toBe(false);
  });

  it('should initialize with empty values', () => {
    expect(component.requestForm.get(ModerationDecisionFormControls.Action)?.value).toBe('');
    expect(component.requestForm.get(ModerationDecisionFormControls.Comment)?.value).toBe('');
  });

  it('should be disabled when action is empty', () => {
    expect(component.isSubmitDisabled).toBe(true);
  });

  it('should be enabled when action is selected', () => {
    component.requestForm.get(ModerationDecisionFormControls.Action)?.setValue(ModerationSubmitType.Accept);

    expect(component.isSubmitDisabled).toBe(false);
  });

  it('should not submit when form is invalid', () => {
    component.handleSubmission();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should handle submission when form is valid and targetId exists', () => {
    component.requestForm.get(ModerationDecisionFormControls.Action)?.setValue(ModerationSubmitType.Accept);
    component.requestForm.get(ModerationDecisionFormControls.Comment)?.setValue('Test comment');

    expect(() => component.handleSubmission()).not.toThrow();
  });

  it('should handle submission with reject action', () => {
    component.requestForm.get(ModerationDecisionFormControls.Action)?.setValue(ModerationSubmitType.Reject);
    component.requestForm.get(ModerationDecisionFormControls.Comment)?.setValue('Reason for rejection');

    expect(() => component.handleSubmission()).not.toThrow();
  });

  it('should handle submission with withdraw action', () => {
    component.requestForm.get(ModerationDecisionFormControls.Action)?.setValue(ModerationSubmitType.Withdraw);

    expect(() => component.handleSubmission()).not.toThrow();
  });

  it('should be invalid when action is empty', () => {
    expect(component.requestForm.valid).toBe(false);
  });

  it('should be valid when action is set', () => {
    component.requestForm.get(ModerationDecisionFormControls.Action)?.setValue(ModerationSubmitType.Accept);

    expect(component.requestForm.valid).toBe(true);
  });

  it('should be valid with action and comment', () => {
    component.requestForm.get(ModerationDecisionFormControls.Action)?.setValue(ModerationSubmitType.Accept);
    component.requestForm.get(ModerationDecisionFormControls.Comment)?.setValue('Good work!');

    expect(component.requestForm.valid).toBe(true);
  });
});
