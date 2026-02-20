import { TestBed } from '@angular/core/testing';

import { FieldType } from '@osf/shared/enums/field-type.enum';
import { Question } from '@osf/shared/models/registration/page-schema.model';

import { RegistrationBlocksDataComponent } from './registration-blocks-data.component';

import { MOCK_REVIEW } from '@testing/mocks/review.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

const MOCK_QUESTIONS: Question[] = [
  { id: '1', displayText: 'Q1', required: true, responseKey: 'question1', fieldType: FieldType.Text },
  { id: '2', displayText: 'Q2', required: false, responseKey: 'question2', fieldType: FieldType.Checkbox },
];

describe('RegistrationBlocksDataComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistrationBlocksDataComponent],
      providers: [provideOSFCore()],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should compute updatedKeysMap from updatedFields', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('updatedFields', ['question1', 'question3']);
    fixture.detectChanges();

    expect(fixture.componentInstance.updatedKeysMap()).toEqual({ question1: true, question3: true });
  });

  it('should return empty updatedKeysMap when updatedFields is empty', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('updatedFields', []);
    fixture.detectChanges();

    expect(fixture.componentInstance.updatedKeysMap()).toEqual({});
  });

  it('should render questions with review data', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', MOCK_REVIEW);
    fixture.detectChanges();

    const headings = fixture.nativeElement.querySelectorAll('h4');
    expect(headings.length).toBe(2);
    expect(headings[0].textContent).toContain('Q1');
  });

  it('should show required error when question is required and no data on non-overview page', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', {});
    fixture.componentRef.setInput('isOverviewPage', false);
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll('p-message[severity="error"]');
    expect(errorMessages.length).toBe(1);
  });

  it('should not show required error on overview page', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', {});
    fixture.componentRef.setInput('isOverviewPage', true);
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll('p-message[severity="error"]');
    expect(errorMessages.length).toBe(0);
  });

  it('should show updated tag when field is updated and not original revision', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', MOCK_REVIEW);
    fixture.componentRef.setInput('updatedFields', ['question1']);
    fixture.componentRef.setInput('isOriginalRevision', false);
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('p-tag');
    expect(tags.length).toBe(1);
  });

  it('should not show updated tag on original revision', () => {
    const fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', MOCK_REVIEW);
    fixture.componentRef.setInput('updatedFields', ['question1']);
    fixture.componentRef.setInput('isOriginalRevision', true);
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('p-tag');
    expect(tags.length).toBe(0);
  });
});
