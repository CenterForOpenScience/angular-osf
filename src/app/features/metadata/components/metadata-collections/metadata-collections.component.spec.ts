import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import {
  MOCK_CEDAR_RECORD,
  MOCK_CEDAR_SUBMISSION,
  MOCK_CEDAR_TEMPLATE,
} from '@testing/data/collections/cedar-metadata.mock';
import { MOCK_PROJECT_COLLECTION_SUBMISSIONS } from '@testing/data/collections/collection-submissions.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { MetadataCollectionsComponent } from './metadata-collections.component';

const mockTemplateId = MOCK_CEDAR_TEMPLATE.id;
const mockCedarTemplate = MOCK_CEDAR_TEMPLATE;
const mockCedarRecord = MOCK_CEDAR_RECORD;
const mockSubmissionsWithTemplate = [MOCK_CEDAR_SUBMISSION];

describe('MetadataCollectionsComponent', () => {
  let component: MetadataCollectionsComponent;
  let fixture: ComponentFixture<MetadataCollectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataCollectionsComponent],
      providers: [provideOSFCore(), MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build())],
    });

    fixture = TestBed.createComponent(MetadataCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show skeleton while loading submissions', () => {
    fixture.componentRef.setInput('isProjectSubmissionsLoading', true);
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('p-skeleton'));
    expect(skeleton).toBeTruthy();
  });

  it('should render collection items when submissions exist', () => {
    fixture.componentRef.setInput('isProjectSubmissionsLoading', false);
    fixture.componentRef.setInput('projectSubmissions', MOCK_PROJECT_COLLECTION_SUBMISSIONS);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('osf-metadata-collection-item'));
    expect(items.length).toBe(MOCK_PROJECT_COLLECTION_SUBMISSIONS.length);
  });

  it('should show empty state message when there are no submissions', () => {
    fixture.componentRef.setInput('projectSubmissions', []);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('project.overview.metadata.noCollections');
  });

  it('should default isCedarMode to false', () => {
    expect(component.isCedarMode()).toBe(false);
  });

  it('should build cedarRecordByTemplateId map from records', () => {
    fixture.componentRef.setInput('cedarRecords', [mockCedarRecord]);
    fixture.detectChanges();

    const map = component.cedarRecordByTemplateId();
    expect(map.get(mockTemplateId)).toEqual(mockCedarRecord);
  });

  it('should build empty cedarRecordByTemplateId map when no records', () => {
    fixture.componentRef.setInput('cedarRecords', null);
    fixture.detectChanges();

    expect(component.cedarRecordByTemplateId().size).toBe(0);
  });

  it('should build cedarTemplateById map from templates', () => {
    fixture.componentRef.setInput('cedarTemplates', [mockCedarTemplate]);
    fixture.detectChanges();

    const map = component.cedarTemplateById();
    expect(map.get(mockTemplateId)).toEqual(mockCedarTemplate);
  });

  it('should build empty cedarTemplateById map when no templates', () => {
    fixture.componentRef.setInput('cedarTemplates', null);
    fixture.detectChanges();

    expect(component.cedarTemplateById().size).toBe(0);
  });

  it('should pass matching cedarRecord to items in cedar mode', () => {
    fixture.componentRef.setInput('isCedarMode', true);
    fixture.componentRef.setInput('projectSubmissions', mockSubmissionsWithTemplate);
    fixture.componentRef.setInput('cedarRecords', [mockCedarRecord]);
    fixture.componentRef.setInput('cedarTemplates', [mockCedarTemplate]);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('osf-metadata-collection-item'));
    expect(items.length).toBe(1);
  });
});
