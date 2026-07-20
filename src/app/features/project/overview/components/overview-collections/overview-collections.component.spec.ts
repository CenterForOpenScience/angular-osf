import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { CedarMetadataDataTemplateJsonApi } from '@osf/features/metadata/models';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';

import { CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK } from '@testing/mocks/cedar-metadata-data-template-json-api.mock';
import { MOCK_CEDAR_METADATA_RECORD_DATA } from '@testing/mocks/cedar-metadata-record.mock';
import {
  MOCK_COLLECTION_SUBMISSION_EMPTY_FILTERS,
  MOCK_COLLECTION_SUBMISSION_SINGLE_FILTER,
  MOCK_COLLECTION_SUBMISSION_STRINGIFY,
  MOCK_COLLECTION_SUBMISSION_WITH_FILTERS,
  MOCK_COLLECTION_SUBMISSIONS,
} from '@testing/mocks/collections-submissions.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { OverviewCollectionsComponent } from './overview-collections.component';

describe('OverviewCollectionsComponent', () => {
  let component: OverviewCollectionsComponent;
  let fixture: ComponentFixture<OverviewCollectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverviewCollectionsComponent],
      providers: [provideOSFCore(), provideRouter([])],
    });

    fixture = TestBed.createComponent(OverviewCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.projectSubmissions()).toBeNull();
    expect(component.isProjectSubmissionsLoading()).toBe(false);
  });

  it('should accept projectSubmissions and isProjectSubmissionsLoading via setInput', () => {
    const submissions: CollectionSubmission[] = MOCK_COLLECTION_SUBMISSIONS.map((s) => ({
      ...s,
      collectionTitle: s.title,
      collectionId: `col-${s.id}`,
    })) as CollectionSubmission[];
    fixture.componentRef.setInput('projectSubmissions', submissions);
    fixture.componentRef.setInput('isProjectSubmissionsLoading', true);
    fixture.detectChanges();
    expect(component.projectSubmissions()).toEqual(submissions);
    expect(component.isProjectSubmissionsLoading()).toBe(true);
  });

  it('should return empty array from getSubmissionAttributes when submission has no filter values', () => {
    expect(component.getSubmissionAttributes(MOCK_COLLECTION_SUBMISSION_EMPTY_FILTERS)).toEqual([]);
  });

  it('should return attributes for truthy filter keys from getSubmissionAttributes', () => {
    const result = component.getSubmissionAttributes(MOCK_COLLECTION_SUBMISSION_WITH_FILTERS);
    const programAreaFilter = collectionFilterNames.find((f) => f.key === 'programArea');
    const collectedTypeFilter = collectionFilterNames.find((f) => f.key === 'collectedType');
    const statusFilter = collectionFilterNames.find((f) => f.key === 'status');
    expect(result).toContainEqual({
      key: 'programArea',
      label: programAreaFilter?.label,
      value: 'Health',
    });
    expect(result).toContainEqual({
      key: 'collectedType',
      label: collectedTypeFilter?.label,
      value: 'Article',
    });
    expect(result).toContainEqual({
      key: 'status',
      label: statusFilter?.label,
      value: 'Published',
    });
    expect(result.length).toBe(3);
  });

  it('should exclude falsy values from getSubmissionAttributes', () => {
    const result = component.getSubmissionAttributes(MOCK_COLLECTION_SUBMISSION_SINGLE_FILTER);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('collectedType');
    expect(result[0].value).toBe('Article');
  });

  it('should stringify numeric-like values in getSubmissionAttributes', () => {
    const result = component.getSubmissionAttributes(MOCK_COLLECTION_SUBMISSION_STRINGIFY);
    const statusAttr = result.find((a) => a.key === 'status');
    expect(statusAttr?.value).toBe('1');
    expect(typeof statusAttr?.value).toBe('string');
  });

  it('should display cedar attributes as key-value pairs when isCedarMode is true with matching record and template', async () => {
    const cedarSubmission: CollectionSubmission = {
      ...MOCK_COLLECTION_SUBMISSION_EMPTY_FILTERS,
      requiredMetadataTemplateId: 'template-1',
    };
    const cedarTemplate: CedarMetadataDataTemplateJsonApi =
      CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK as CedarMetadataDataTemplateJsonApi;

    fixture.componentRef.setInput('projectSubmissions', [cedarSubmission]);
    fixture.componentRef.setInput('isCedarMode', true);
    fixture.componentRef.setInput('cedarRecords', [MOCK_CEDAR_METADATA_RECORD_DATA]);
    fixture.componentRef.setInput('cedarTemplates', [cedarTemplate]);
    fixture.detectChanges();
    await fixture.whenStable();

    const paragraphs = fixture.nativeElement.querySelectorAll('p.font-normal');
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain('Project Name');
    expect(fixture.nativeElement.textContent).toContain('Test Project Name');
  });

  it('should display submission attributes when isCedarMode is false', async () => {
    const cedarSubmission: CollectionSubmission = {
      ...MOCK_COLLECTION_SUBMISSION_WITH_FILTERS,
      requiredMetadataTemplateId: 'template-1',
    };
    const cedarTemplate: CedarMetadataDataTemplateJsonApi =
      CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK as CedarMetadataDataTemplateJsonApi;

    fixture.componentRef.setInput('projectSubmissions', [cedarSubmission]);
    fixture.componentRef.setInput('isCedarMode', false);
    fixture.componentRef.setInput('cedarRecords', [MOCK_CEDAR_METADATA_RECORD_DATA]);
    fixture.componentRef.setInput('cedarTemplates', [cedarTemplate]);
    fixture.detectChanges();
    await fixture.whenStable();

    const attributes = component.getSubmissionAttributes(cedarSubmission);
    expect(attributes.length).toBeGreaterThan(0);
    const paragraphs = fixture.nativeElement.querySelectorAll('p.font-normal');
    expect(paragraphs.length).toBe(attributes.length);
  });

  it('should fall back to submission attributes when isCedarMode is true but no matching record', async () => {
    const cedarSubmission: CollectionSubmission = {
      ...MOCK_COLLECTION_SUBMISSION_WITH_FILTERS,
      requiredMetadataTemplateId: 'non-existent-template',
    };

    fixture.componentRef.setInput('projectSubmissions', [cedarSubmission]);
    fixture.componentRef.setInput('isCedarMode', true);
    fixture.componentRef.setInput('cedarRecords', []);
    fixture.componentRef.setInput('cedarTemplates', []);
    fixture.detectChanges();
    await fixture.whenStable();

    const attributes = component.getSubmissionAttributes(cedarSubmission);
    expect(attributes.length).toBeGreaterThan(0);
    const paragraphs = fixture.nativeElement.querySelectorAll('p.font-normal');
    expect(paragraphs.length).toBe(attributes.length);
  });

  it('should extract key-value pairs from a cedar record using template field order and labels', () => {
    const cedarTemplate: CedarMetadataDataTemplateJsonApi =
      CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK as CedarMetadataDataTemplateJsonApi;

    const result = component.getCedarAttributes(MOCK_CEDAR_METADATA_RECORD_DATA, cedarTemplate);

    expect(result).toContainEqual({ key: 'Project Name', label: 'Project Name', value: 'Test Project Name' });
  });

  it('should compute empty cedarRecordByTemplateId map when cedarRecords is null', () => {
    fixture.componentRef.setInput('cedarRecords', null);
    fixture.detectChanges();
    expect(component.cedarRecordByTemplateId().size).toBe(0);
  });

  it('should compute empty cedarTemplateById map when cedarTemplates is null', () => {
    fixture.componentRef.setInput('cedarTemplates', null);
    fixture.detectChanges();
    expect(component.cedarTemplateById().size).toBe(0);
  });
});
