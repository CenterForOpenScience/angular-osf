import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ModerationDecisionFormControls,
  RegistrationReviewStates,
  ReviewActionTrigger,
  RevisionReviewStates,
  SchemaResponseActionTrigger,
} from '@osf/shared/enums';
import { DateAgoPipe } from '@shared/pipes';

import { RegistryMakeDecisionComponent } from './registry-make-decision.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { MOCK_REGISTRY_OVERVIEW } from '@testing/mocks/registry-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryMakeDecisionComponent', () => {
  let component: RegistryMakeDecisionComponent;
  let fixture: ComponentFixture<RegistryMakeDecisionComponent>;
  let mockDialogRef: jest.Mocked<DynamicDialogRef>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  const mockRegistry = {
    ...MOCK_REGISTRY_OVERVIEW,
    reviewsState: RegistrationReviewStates.Accepted,
    revisionStatus: RevisionReviewStates.Approved,
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
            { selector: 'RegistryOverviewSelectors.getReviewActions', value: [] },
            { selector: 'RegistryOverviewSelectors.isReviewActionSubmitting', value: false },
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

  it('should compute isPendingModeration correctly', () => {
    expect(component.isPendingModeration).toBe(false);

    mockDialogConfig.data.registry = {
      ...mockRegistry,
      revisionStatus: RevisionReviewStates.RevisionPendingModeration,
    };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isPendingModeration).toBe(true);
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
    expect(component.acceptValue).toBe(SchemaResponseActionTrigger.AcceptRevision);
  });

  it('should compute acceptValue correctly for pending withdrawal', () => {
    mockDialogConfig.data.registry = { ...mockRegistry, reviewsState: RegistrationReviewStates.PendingWithdraw };
    fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.acceptValue).toBe(ReviewActionTrigger.AcceptWithdrawal);
  });

  it('should compute rejectValue correctly for pending review', () => {
    expect(component.rejectValue).toBe(SchemaResponseActionTrigger.RejectRevision);
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

    component.requestForm.patchValue({
      [ModerationDecisionFormControls.Action]: ReviewActionTrigger.AcceptSubmission,
      [ModerationDecisionFormControls.Comment]: 'Test comment',
    });

    component.handleSubmission();

    expect(submitDecisionSpy).toHaveBeenCalledWith(
      {
        targetId: 'test-revision-id',
        action: ReviewActionTrigger.AcceptSubmission,
        comment: 'Test comment',
      },
      true
    );
    expect(closeSpy).toHaveBeenCalled();
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
      { reviewsState: RegistrationReviewStates.Pending, revisionStatus: RevisionReviewStates.Approved },
      { reviewsState: RegistrationReviewStates.Accepted, revisionStatus: RevisionReviewStates.Approved },
      { reviewsState: RegistrationReviewStates.PendingWithdraw, revisionStatus: RevisionReviewStates.Approved },
    ];

    states.forEach((state) => {
      mockDialogConfig.data.registry = { ...mockRegistry, ...state };

      fixture = TestBed.createComponent(RegistryMakeDecisionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.registry.reviewsState).toBe(state.reviewsState);
      expect(component.registry.revisionStatus).toBe(state.revisionStatus);
    });
  });
});
