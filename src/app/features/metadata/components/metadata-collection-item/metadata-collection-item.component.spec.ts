import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.models';

import { MetadataCollectionItemComponent } from './metadata-collection-item.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataCollectionItemComponent', () => {
  let component: MetadataCollectionItemComponent;
  let fixture: ComponentFixture<MetadataCollectionItemComponent>;

  const mockSubmission: CollectionSubmission = {
    id: '1',
    type: 'collection-submission',
    collectionTitle: 'Test Collection',
    collectionId: 'collection-123',
    reviewsState: CollectionSubmissionReviewState.Pending,
    collectedType: 'preprint',
    status: 'pending',
    volume: '1',
    issue: '1',
    programArea: 'Science',
    schoolType: 'University',
    studyDesign: 'Experimental',
    dataType: 'Quantitative',
    disease: 'Cancer',
    gradeLevels: 'Graduate',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataCollectionItemComponent, OSFTestingModule, ...MockComponents()],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataCollectionItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with submission input', () => {
    expect(component.submission()).toEqual(mockSubmission);
  });

  it('should compute attributes from submission', () => {
    const attributes = component.attributes();
    expect(attributes.length).toBeGreaterThan(0);
    expect(attributes.some((attr) => attr.key === 'programArea' && attr.value === 'Science')).toBe(true);
    expect(attributes.some((attr) => attr.key === 'collectedType' && attr.value === 'preprint')).toBe(true);
    expect(attributes.some((attr) => attr.key === 'dataType' && attr.value === 'Quantitative')).toBe(true);
  });

  it('should filter out empty attributes', () => {
    const submissionWithEmptyFields: CollectionSubmission = {
      ...mockSubmission,
      programArea: '',
      disease: '',
      gradeLevels: '',
    };
    fixture.componentRef.setInput('submission', submissionWithEmptyFields);
    fixture.detectChanges();

    const attributes = component.attributes();
    expect(attributes.some((attr) => attr.key === 'programArea')).toBe(false);
    expect(attributes.some((attr) => attr.key === 'disease')).toBe(false);
    expect(attributes.some((attr) => attr.key === 'gradeLevels')).toBe(false);
  });

  it('should display collection title', () => {
    const button = fixture.nativeElement.querySelector('p-button[osfStopPropagation]');
    expect(button).toBeTruthy();
    expect(button.getAttribute('ng-reflect-label')).toBe(mockSubmission.collectionTitle);
  });

  it('should display status tag for Pending state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Pending,
    });
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).toBeTruthy();
    expect(tag.getAttribute('ng-reflect-severity')).toBe('warn');
  });

  it('should display status tag for Accepted state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Accepted,
    });
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).toBeTruthy();
    expect(tag.getAttribute('ng-reflect-severity')).toBe('success');
  });

  it('should display status tag for Rejected state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Rejected,
    });
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).toBeTruthy();
    expect(tag.getAttribute('ng-reflect-severity')).toBe('danger');
  });

  it('should display status tag for InProgress state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.InProgress,
    });
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).toBeTruthy();
    expect(tag.getAttribute('ng-reflect-severity')).toBe('warn');
  });

  it('should display status tag for Removed state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Removed,
    });
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('p-tag');
    expect(tag).toBeTruthy();
    expect(tag.getAttribute('ng-reflect-severity')).toBe('secondary');
  });

  it('should display attributes when submission has values', () => {
    const attributes = component.attributes();
    expect(attributes.length).toBeGreaterThan(0);

    fixture.detectChanges();
    const attributeElements = fixture.nativeElement.querySelectorAll('.font-normal');
    expect(attributeElements.length).toBe(attributes.length);
  });

  it('should not display attributes section when all fields are empty', () => {
    const submissionWithNoAttributes: CollectionSubmission = {
      id: '1',
      type: 'collection-submission',
      collectionTitle: 'Test Collection',
      collectionId: 'collection-123',
      reviewsState: CollectionSubmissionReviewState.Pending,
      collectedType: '',
      status: '',
      volume: '',
      issue: '',
      programArea: '',
      schoolType: '',
      studyDesign: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
    };
    fixture.componentRef.setInput('submission', submissionWithNoAttributes);
    fixture.detectChanges();

    const attributes = component.attributes();
    expect(attributes.length).toBe(0);

    const attributesSection = fixture.nativeElement.querySelector('.flex.flex-column.gap-2.mt-2');
    expect(attributesSection).toBeFalsy();
  });

  it('should have CollectionSubmissionReviewState enum available', () => {
    expect(component.CollectionSubmissionReviewState).toBe(CollectionSubmissionReviewState);
  });

  it('should have correct routerLink for edit button', () => {
    const editButton = fixture.nativeElement.querySelector('p-button[routerLink]');
    expect(editButton).toBeTruthy();
    expect(editButton.getAttribute('ng-reflect-router-link')).toContain(mockSubmission.collectionId);
    expect(editButton.getAttribute('ng-reflect-router-link')).toContain(mockSubmission.id);
  });
});
