import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipes } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent, IconComponent } from '@osf/shared/components';
import { DateAgoPipe } from '@osf/shared/pipes';

import { SubmissionReviewStatus } from '../../enums';
import { PreprintSubmissionModel } from '../../models';

import { PreprintSubmissionItemComponent } from './preprint-submission-item.component';

import { MOCK_PREPRINT_SUBMISSION } from '@testing/mocks/submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintSubmissionItemComponent', () => {
  let component: PreprintSubmissionItemComponent;
  let fixture: ComponentFixture<PreprintSubmissionItemComponent>;

  const mockSubmission: PreprintSubmissionModel = MOCK_PREPRINT_SUBMISSION;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintSubmissionItemComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, ContributorsListComponent),
        MockPipes(DateAgoPipe, TranslatePipe),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSubmissionItemComponent);
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
    expect(component.actionLabel).toBeDefined();
    expect(component.actionState).toBeDefined();
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

  it('should emit selected event', () => {
    jest.spyOn(component.selected, 'emit');
    component.selected.emit();
    expect(component.selected.emit).toHaveBeenCalled();
  });

  it('should accept custom input values', () => {
    const customStatus = SubmissionReviewStatus.Accepted;
    const customSubmission = {
      ...mockSubmission,
      title: 'Custom Preprint',
      actions: [
        ...mockSubmission.actions,
        {
          id: '2',
          trigger: 'manual',
          fromState: 'pending',
          toState: 'accepted',
          dateModified: '2023-01-02',
          creator: {
            id: 'user-2',
            name: 'Jane Doe',
          },
          comment: 'Approved',
        },
      ],
    };

    fixture.componentRef.setInput('status', customStatus);
    fixture.componentRef.setInput('submission', customSubmission);

    expect(component.status()).toBe(customStatus);
    expect(component.submission()).toEqual(customSubmission);
  });
});
