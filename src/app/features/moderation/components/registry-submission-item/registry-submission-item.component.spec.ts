import { MockComponent, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components';
import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
import { DateAgoPipe } from '@osf/shared/pipes';

import { SubmissionReviewStatus } from '../../enums';
import { RegistryModeration } from '../../models';

import { RegistrySubmissionItemComponent } from './registry-submission-item.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistrySubmissionItemComponent', () => {
  let component: RegistrySubmissionItemComponent;
  let fixture: ComponentFixture<RegistrySubmissionItemComponent>;

  const mockSubmission: RegistryModeration = {
    id: '1',
    title: 'Test Registry Submission',
    revisionStatus: RevisionReviewStates.RevisionPendingModeration,
    reviewsState: RegistrationReviewStates.Pending,
    public: false,
    embargoed: false,
    embargoEndDate: null,
    actions: [
      {
        id: '1',
        trigger: 'manual',
        fromState: 'pending',
        toState: 'pending',
        dateModified: '2023-01-01',
        creator: {
          id: 'user-1',
          name: 'John Doe',
        },
        comment: 'Registry submission',
      },
    ],
    revisionId: 'revision-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrySubmissionItemComponent, OSFTestingModule, MockComponent(IconComponent), MockPipe(DateAgoPipe)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySubmissionItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', SubmissionReviewStatus.Pending);
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input values', () => {
    expect(component.status()).toBe(SubmissionReviewStatus.Pending);
    expect(component.submission()).toEqual(mockSubmission);
  });

  it('should have constants defined', () => {
    expect(component.reviewStatusIcon).toBeDefined();
    expect(component.registryActionLabel).toBeDefined();
    expect(component.registryActionState).toBeDefined();
  });

  it('should have default values', () => {
    expect(component.limitValue).toBe(1);
    expect(component.showAll).toBe(false);
  });

  it('should toggle history', () => {
    expect(component.showAll).toBe(false);

    component.toggleHistory();
    expect(component.showAll).toBe(true);

    component.toggleHistory();
    expect(component.showAll).toBe(false);
  });

  it('should compute isPendingModeration correctly', () => {
    expect(component.isPendingModeration).toBe(true);
  });

  it('should compute isPending correctly', () => {
    expect(component.isPending).toBe(true);
  });

  it('should accept custom input values', () => {
    const customStatus = SubmissionReviewStatus.Accepted;
    const customSubmission = { ...mockSubmission, title: 'Custom Registry Submission' };

    fixture.componentRef.setInput('status', customStatus);
    fixture.componentRef.setInput('submission', customSubmission);

    expect(component.status()).toBe(customStatus);
    expect(component.submission()).toEqual(customSubmission);
  });
});
