import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipes } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@shared/components';
import { DateAgoPipe } from '@shared/pipes';

import { PreprintSubmissionItemComponent } from './preprint-submission-item.component';

describe('PreprintSubmissionItemComponent', () => {
  let component: PreprintSubmissionItemComponent;
  let componentRef: ComponentRef<PreprintSubmissionItemComponent>;
  let fixture: ComponentFixture<PreprintSubmissionItemComponent>;

  const mockSubmission = {
    id: 'reg1',
    title: 'Test registry submission',
    reviewsState: 'pending',
    public: true,
    embargoed: false,
    embargoEndDate: null,
    actions: [
      {
        id: 'a1',
        fromState: 'pending',
        toState: 'accepted',
        dateModified: new Date().toISOString(),
        creator: { id: 'u1', name: 'Bob' },
        comment: '',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintSubmissionItemComponent, MockComponent(IconComponent), MockPipes(DateAgoPipe, TranslatePipe)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSubmissionItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('status', 'pending');
    componentRef.setInput('submission', mockSubmission);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
