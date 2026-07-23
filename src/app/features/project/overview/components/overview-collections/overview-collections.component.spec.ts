import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CedarMetadataDataTemplateJsonApi } from '@osf/features/metadata/models';
import { CollectionSubmission } from '@osf/shared/models/collections/collection-submissions.model';

import { CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK } from '@testing/mocks/cedar-metadata-data-template-json-api.mock';
import { MOCK_CEDAR_METADATA_RECORD_DATA } from '@testing/mocks/cedar-metadata-record.mock';
import {
  MOCK_COLLECTION_SUBMISSION_BASE,
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
    }));
    fixture.componentRef.setInput('projectSubmissions', submissions);
    fixture.componentRef.setInput('isProjectSubmissionsLoading', true);
    fixture.detectChanges();
    expect(component.projectSubmissions()).toEqual(submissions);
    expect(component.isProjectSubmissionsLoading()).toBe(true);
  });

  it('should display cedar attributes as key-value pairs when there is a matching record and template', async () => {
    const cedarSubmission: CollectionSubmission = {
      ...MOCK_COLLECTION_SUBMISSION_BASE,
      requiredMetadataTemplateId: 'template-1',
    };
    const cedarTemplate: CedarMetadataDataTemplateJsonApi =
      CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK as CedarMetadataDataTemplateJsonApi;

    fixture.componentRef.setInput('projectSubmissions', [cedarSubmission]);
    fixture.componentRef.setInput('cedarRecords', [MOCK_CEDAR_METADATA_RECORD_DATA]);
    fixture.componentRef.setInput('cedarTemplates', [cedarTemplate]);
    fixture.detectChanges();
    await fixture.whenStable();

    const paragraphs = fixture.nativeElement.querySelectorAll('p.font-normal');
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain('Project Name');
    expect(fixture.nativeElement.textContent).toContain('Test Project Name');
  });

  it('should not display attributes when there is no matching cedar record', async () => {
    const cedarSubmission: CollectionSubmission = {
      ...MOCK_COLLECTION_SUBMISSION_BASE,
      requiredMetadataTemplateId: 'non-existent-template',
    };

    fixture.componentRef.setInput('projectSubmissions', [cedarSubmission]);
    fixture.componentRef.setInput('cedarRecords', []);
    fixture.componentRef.setInput('cedarTemplates', []);
    fixture.detectChanges();
    await fixture.whenStable();

    const paragraphs = fixture.nativeElement.querySelectorAll('p.font-normal');
    expect(paragraphs.length).toBe(0);
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
