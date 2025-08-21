import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
import { RegistrationCard } from '@osf/shared/models';
import { MOCK_REGISTRATION, TranslateServiceMock } from '@shared/mocks';

import { RegistrationCardComponent } from './registration-card.component';

describe('RegistrationCardComponent', () => {
  let component: RegistrationCardComponent;
  let fixture: ComponentFixture<RegistrationCardComponent>;

  const mockRegistrationData: RegistrationCard = MOCK_REGISTRATION;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationCardComponent],
      providers: [TranslateServiceMock, MockProvider(ActivatedRoute), MockProvider(Router)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have registrationData as required input', () => {
    fixture.componentRef.setInput('registrationData', mockRegistrationData);
    expect(component.registrationData()).toEqual(mockRegistrationData);
  });

  it('should compute isAccepted correctly when reviewsState is Accepted', () => {
    const testData = {
      ...mockRegistrationData,
      reviewsState: RegistrationReviewStates.Accepted,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isAccepted).toBe(true);
  });

  it('should compute isPending correctly when reviewsState is Pending', () => {
    const testData = {
      ...mockRegistrationData,
      reviewsState: RegistrationReviewStates.Pending,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isPending).toBe(true);
  });

  it('should compute isApproved correctly when revisionState is Approved', () => {
    const testData = {
      ...mockRegistrationData,
      revisionState: RevisionReviewStates.Approved,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isApproved).toBe(true);
  });

  it('should compute isUnapproved correctly when revisionState is Unapproved', () => {
    const testData = {
      ...mockRegistrationData,
      revisionState: RevisionReviewStates.Unapproved,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isUnapproved).toBe(true);
  });

  it('should compute isInProgress correctly when revisionState is RevisionInProgress', () => {
    const testData = {
      ...mockRegistrationData,
      revisionState: RevisionReviewStates.RevisionInProgress,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isInProgress).toBe(true);
  });

  it('should compute isAccepted as false when reviewsState is not Accepted', () => {
    const testData = {
      ...mockRegistrationData,
      reviewsState: RegistrationReviewStates.Pending,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isAccepted).toBe(false);
  });

  it('should compute isPending as false when reviewsState is not Pending', () => {
    const testData = {
      ...mockRegistrationData,
      reviewsState: RegistrationReviewStates.Accepted,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isPending).toBe(false);
  });

  it('should compute isApproved as false when revisionState is not Approved', () => {
    const testData = {
      ...mockRegistrationData,
      revisionState: RevisionReviewStates.Unapproved,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isApproved).toBe(false);
  });

  it('should compute isUnapproved as false when revisionState is not Unapproved', () => {
    const testData = {
      ...mockRegistrationData,
      revisionState: RevisionReviewStates.Approved,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isUnapproved).toBe(false);
  });

  it('should compute isInProgress as false when revisionState is not RevisionInProgress', () => {
    const testData = {
      ...mockRegistrationData,
      revisionState: RevisionReviewStates.Approved,
    };
    fixture.componentRef.setInput('registrationData', testData);
    fixture.detectChanges();

    expect(component.isInProgress).toBe(false);
  });
});
