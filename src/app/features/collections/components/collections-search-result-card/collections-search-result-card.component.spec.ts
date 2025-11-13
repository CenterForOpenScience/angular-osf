import { MockComponent } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { CollectionSubmissionWithGuid } from '@osf/shared/models/collections/collections.models';

import { CollectionsSearchResultCardComponent } from './collections-search-result-card.component';

import { MOCK_COLLECTION_SUBMISSION_WITH_GUID } from '@testing/mocks/submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CollectionsSearchResultCardComponent', () => {
  let component: CollectionsSearchResultCardComponent;
  let componentRef: ComponentRef<CollectionsSearchResultCardComponent>;
  let fixture: ComponentFixture<CollectionsSearchResultCardComponent>;

  const mockCardItem: CollectionSubmissionWithGuid = MOCK_COLLECTION_SUBMISSION_WITH_GUID;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsSearchResultCardComponent, OSFTestingModule, MockComponent(ContributorsListComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsSearchResultCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('cardItem', mockCardItem);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have cardItem input', () => {
    expect(component.cardItem()).toEqual(mockCardItem);
  });

  it('should compute present submission attributes correctly', () => {
    const presentAttributes = component.presentSubmissionAttributes();

    expect(presentAttributes).toBeDefined();
    expect(Array.isArray(presentAttributes)).toBe(true);
    expect(presentAttributes.length).toBeGreaterThan(0);

    presentAttributes.forEach((attribute) => {
      expect(attribute.value).toBeTruthy();
      expect(attribute.key).toBeDefined();
      expect(attribute.label).toBeDefined();
    });
  });

  it('should include all filter attributes with values', () => {
    const presentAttributes = component.presentSubmissionAttributes();
    const attributeKeys = presentAttributes.map((attr) => attr.key);

    expect(attributeKeys).toContain('programArea');
    expect(attributeKeys).toContain('collectedType');
    expect(attributeKeys).toContain('status');
    expect(attributeKeys).toContain('volume');
    expect(attributeKeys).toContain('issue');
    expect(attributeKeys).toContain('schoolType');
    expect(attributeKeys).toContain('studyDesign');
    expect(attributeKeys).toContain('dataType');
    expect(attributeKeys).toContain('disease');
    expect(attributeKeys).toContain('gradeLevels');
  });

  it('should have correct attribute structure', () => {
    const presentAttributes = component.presentSubmissionAttributes();

    presentAttributes.forEach((attribute) => {
      expect(attribute).toHaveProperty('key');
      expect(attribute).toHaveProperty('label');
      expect(attribute).toHaveProperty('value');
      expect(typeof attribute.key).toBe('string');
      expect(typeof attribute.label).toBe('string');
      expect(typeof attribute.value).toBe('string');
    });
  });

  it('should handle partial attributes', () => {
    const partialCardItem: CollectionSubmissionWithGuid = {
      ...mockCardItem,
      programArea: 'Science',
      collectedType: 'preprint',
      status: 'pending',
      volume: '',
      issue: '',
      schoolType: '',
      studyDesign: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
    };

    componentRef.setInput('cardItem', partialCardItem);
    fixture.detectChanges();

    const presentAttributes = component.presentSubmissionAttributes();

    expect(presentAttributes.length).toBe(3);
    expect(presentAttributes.map((attr) => attr.key)).toEqual(['programArea', 'collectedType', 'status']);
  });

  it('should handle cardItem with only some attributes', () => {
    const minimalCardItem: CollectionSubmissionWithGuid = {
      ...mockCardItem,
      programArea: 'Science',
      collectedType: '',
      status: '',
      volume: '',
      issue: '',
      schoolType: '',
      studyDesign: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
    };

    componentRef.setInput('cardItem', minimalCardItem);
    fixture.detectChanges();

    const presentAttributes = component.presentSubmissionAttributes();

    expect(presentAttributes.length).toBe(1);
    expect(presentAttributes[0].key).toBe('programArea');
    expect(presentAttributes[0].value).toBe('Science');
  });

  it('should handle empty string values', () => {
    const emptyStringCardItem: CollectionSubmissionWithGuid = {
      ...mockCardItem,
      programArea: '',
      collectedType: '',
      status: '',
      volume: '',
      issue: '',
      schoolType: '',
      studyDesign: '',
      dataType: '',
      disease: '',
      gradeLevels: '',
    };

    componentRef.setInput('cardItem', emptyStringCardItem);
    fixture.detectChanges();

    const presentAttributes = component.presentSubmissionAttributes();
    expect(presentAttributes.length).toBe(0);
  });
});
