import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collection-submissions.model';

import {
  MOCK_CEDAR_RECORD,
  MOCK_CEDAR_SUBMISSION,
  MOCK_CEDAR_TEMPLATE,
} from '@testing/data/collections/cedar-metadata.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataCollectionItemComponent } from './metadata-collection-item.component';

const mockSubmission: CollectionSubmission = MOCK_CEDAR_SUBMISSION;
const mockCedarTemplate = MOCK_CEDAR_TEMPLATE;
const mockCedarRecord = MOCK_CEDAR_RECORD;

describe('MetadataCollectionItemComponent', () => {
  let component: MetadataCollectionItemComponent;
  let fixture: ComponentFixture<MetadataCollectionItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataCollectionItemComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(MetadataCollectionItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();
  });

  it('should initialize with submission input', () => {
    expect(component.submission()).toEqual(mockSubmission);
  });

  it('should toggle submission button visibility based on reviews state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Accepted,
    });
    fixture.detectChanges();

    expect(component.showSubmissionButton()).toBe(true);

    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Pending,
    });
    fixture.detectChanges();

    expect(component.showSubmissionButton()).toBe(false);
  });

  it('should switch submission button label for removed status', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Removed,
    });
    fixture.detectChanges();

    expect(component.submissionButtonLabel()).toBe('common.buttons.resubmit');

    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Accepted,
    });
    fixture.detectChanges();

    expect(component.submissionButtonLabel()).toBe('common.buttons.edit');
  });

  describe('CEDAR mode', () => {
    it('should not show cedar viewer when cedarRecord is null', () => {
      fixture.componentRef.setInput('cedarRecord', null);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should not show cedar viewer when cedarTemplate is null', () => {
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', null);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should show cedar viewer when record and template are provided', () => {
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(true);
    });

    it('should not show cedar viewer when submission is removed', () => {
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.componentRef.setInput('submission', {
        ...mockSubmission,
        reviewsState: CollectionSubmissionReviewState.Removed,
      });
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should compute cedarMetadata from record', () => {
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.detectChanges();

      expect(component.cedarMetadata()).toEqual({ field: 'value' });
    });

    it('should return empty object for cedarMetadata when no record', () => {
      fixture.componentRef.setInput('cedarRecord', null);
      fixture.detectChanges();

      expect(component.cedarMetadata()).toEqual({});
    });
  });
});
