import { ComponentFixture, TestBed } from '@angular/core/testing';

import { collectionFilterNames } from '@osf/features/collections/constants';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';

import { OverviewCollectionsComponent } from './overview-collections.component';

import {
  MOCK_COLLECTION_SUBMISSION_EMPTY_FILTERS,
  MOCK_COLLECTION_SUBMISSION_SINGLE_FILTER,
  MOCK_COLLECTION_SUBMISSION_STRINGIFY,
  MOCK_COLLECTION_SUBMISSION_WITH_FILTERS,
  MOCK_COLLECTION_SUBMISSIONS,
} from '@testing/mocks/collections-submissions.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('OverviewCollectionsComponent', () => {
  let component: OverviewCollectionsComponent;
  let fixture: ComponentFixture<OverviewCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewCollectionsComponent, OSFTestingModule],
    }).compileComponents();

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
});
