import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipes } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IconComponent } from '@shared/components';
import { DateAgoPipe } from '@shared/pipes';

import { RegistrySubmissionItemComponent } from './registry-submission-item.component';

describe('RegistrySubmissionItemComponent', () => {
  let component: RegistrySubmissionItemComponent;
  let componentRef: ComponentRef<RegistrySubmissionItemComponent>;
  let fixture: ComponentFixture<RegistrySubmissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrySubmissionItemComponent,
        RouterTestingModule,
        MockComponent(IconComponent),
        MockPipes(DateAgoPipe, TranslatePipe),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrySubmissionItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

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

    componentRef.setInput('status', 'pending');
    componentRef.setInput('submission', mockSubmission);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
