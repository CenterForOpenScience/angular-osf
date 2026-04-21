import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData } from '@osf/features/metadata/models';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataCollectionItemComponent } from './metadata-collection-item.component';

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
  requiredMetadataTemplateId: 'template-1',
};

const mockCedarTemplate: CedarMetadataDataTemplateJsonApi = {
  id: 'template-1',
  type: 'cedar-metadata-templates',
  attributes: {
    schema_name: 'Test Template',
    cedar_id: 'cedar-1',
    template: {
      '@id': 'https://repo.metadatacenter.org/templates/1',
      '@type': 'https://schema.metadatacenter.org/core/Template',
      type: 'object',
      title: 'Test',
      description: 'Test template',
      $schema: 'http://json-schema.org/draft-04/schema#',
      '@context': {
        pav: 'http://purl.org/pav/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        bibo: 'http://purl.org/ontology/bibo/',
        oslc: 'http://open-services.net/ns/core#',
        schema: 'http://schema.org/',
        'schema:name': { '@type': 'xsd:string' },
        'pav:createdBy': { '@type': '@id' },
        'pav:createdOn': { '@type': 'xsd:dateTime' },
        'oslc:modifiedBy': { '@type': '@id' },
        'pav:lastUpdatedOn': { '@type': 'xsd:dateTime' },
        'schema:description': { '@type': 'xsd:string' },
      },
      required: [],
      properties: {},
      _ui: { order: [], propertyLabels: {}, propertyDescriptions: {} },
    },
  },
};

const mockCedarRecord: CedarMetadataRecordData = {
  id: 'record-1',
  attributes: {
    metadata: { field: 'value' } as CedarMetadataRecordData['attributes']['metadata'],
    is_published: true,
  },
  relationships: {
    template: { data: { type: 'cedar-metadata-templates', id: 'template-1' } },
    target: { data: { type: 'nodes', id: 'node-1' } },
  },
};

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

  it('should toggle submission button visibility based on reviews state', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Accepted,
    });
    fixture.detectChanges();

    const submissionButtonVisible = fixture.nativeElement.querySelector('p-button[severity="secondary"]');
    expect(submissionButtonVisible).toBeTruthy();

    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Pending,
    });
    fixture.detectChanges();

    const submissionButtonHidden = fixture.nativeElement.querySelector('p-button[severity="secondary"]');
    expect(submissionButtonHidden).toBeFalsy();
  });

  it('should switch submission button label for removed status', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Accepted,
      status: CollectionSubmissionReviewState.Removed,
    });
    fixture.detectChanges();

    expect(component.submissionButtonLabel()).toBe('common.buttons.resubmit');

    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Accepted,
      status: CollectionSubmissionReviewState.Accepted,
    });
    fixture.detectChanges();

    expect(component.submissionButtonLabel()).toBe('common.buttons.edit');
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

  it('should hide attributes when reviews state is Removed even with data', () => {
    fixture.componentRef.setInput('submission', {
      ...mockSubmission,
      reviewsState: CollectionSubmissionReviewState.Removed,
    });
    fixture.detectChanges();

    expect(component.attributes().length).toBeGreaterThan(0);
    const attributesSection = fixture.nativeElement.querySelector('.flex.flex-column.gap-2.mt-2');
    expect(attributesSection).toBeFalsy();
  });

  describe('CEDAR mode', () => {
    it('should not show cedar viewer when isCedarMode is false', () => {
      fixture.componentRef.setInput('isCedarMode', false);
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should not show cedar viewer when cedarRecord is null', () => {
      fixture.componentRef.setInput('isCedarMode', true);
      fixture.componentRef.setInput('cedarRecord', null);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should not show cedar viewer when cedarTemplate is null', () => {
      fixture.componentRef.setInput('isCedarMode', true);
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', null);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should show cedar viewer when isCedarMode, record, and template are provided', () => {
      fixture.componentRef.setInput('isCedarMode', true);
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(true);
    });

    it('should not show cedar viewer when submission is removed', () => {
      fixture.componentRef.setInput('isCedarMode', true);
      fixture.componentRef.setInput('cedarRecord', mockCedarRecord);
      fixture.componentRef.setInput('cedarTemplate', mockCedarTemplate);
      fixture.componentRef.setInput('submission', {
        ...mockSubmission,
        reviewsState: CollectionSubmissionReviewState.Removed,
      });
      fixture.detectChanges();

      expect(component.showCedarViewer()).toBe(false);
    });

    it('should not show attributes in cedar mode', () => {
      fixture.componentRef.setInput('isCedarMode', true);
      fixture.detectChanges();

      expect(component.showAttributes()).toBe(false);
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
