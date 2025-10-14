import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CollectionSubmissionWithGuid } from '@osf/shared/models';
import { CollectionsSelectors } from '@osf/shared/stores';
import { IconComponent } from '@shared/components';
import { DateAgoPipe } from '@shared/pipes';

import { SubmissionReviewStatus } from '../../enums';

import { CollectionSubmissionItemComponent } from './collection-submission-item.component';

import { MOCK_COLLECTION_SUBMISSION_WITH_GUID } from '@testing/mocks/submission.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CollectionSubmissionItemComponent', () => {
  let component: CollectionSubmissionItemComponent;
  let fixture: ComponentFixture<CollectionSubmissionItemComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockSubmission: CollectionSubmissionWithGuid = MOCK_COLLECTION_SUBMISSION_WITH_GUID;

  const mockCollectionProvider = {
    id: 'provider-123',
    name: 'Test Provider',
  };

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withQueryParams({ status: 'pending' }).build();

    await TestBed.configureTestingModule({
      imports: [
        CollectionSubmissionItemComponent,
        OSFTestingModule,
        MockComponent(IconComponent),
        MockPipe(DateAgoPipe),
      ],
      providers: [
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [{ selector: CollectionsSelectors.getCollectionProvider, value: mockCollectionProvider }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with submission input', () => {
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();

    expect(component.submission()).toEqual(mockSubmission);
  });

  it('should compute current review action correctly', () => {
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();

    const currentAction = component.currentReviewAction();
    expect(currentAction).toEqual(mockSubmission.actions![0]);
  });

  it('should return null for current review action when no actions exist', () => {
    const submissionWithoutActions = { ...mockSubmission, actions: [] };
    fixture.componentRef.setInput('submission', submissionWithoutActions);
    fixture.detectChanges();

    const currentAction = component.currentReviewAction();
    expect(currentAction).toBeNull();
  });

  it('should return null for current review action when actions is undefined', () => {
    const submissionWithoutActions = { ...mockSubmission, actions: undefined };
    fixture.componentRef.setInput('submission', submissionWithoutActions);
    fixture.detectChanges();

    const currentAction = component.currentReviewAction();
    expect(currentAction).toBeNull();
  });

  it('should compute current submission attributes correctly', () => {
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();

    const attributes = component.currentSubmissionAttributes();
    expect(attributes).toBeDefined();
    expect(Array.isArray(attributes)).toBe(true);
  });

  it('should return attributes even when submission has no actions', () => {
    const submissionWithoutActions = { ...mockSubmission, actions: [] };
    fixture.componentRef.setInput('submission', submissionWithoutActions);
    fixture.detectChanges();

    const attributes = component.currentSubmissionAttributes();
    expect(attributes).toBeDefined();
    expect(attributes).not.toBeNull();
    expect(Array.isArray(attributes)).toBe(true);
    expect(attributes!.length).toBeGreaterThan(0);
  });

  it('should return attributes with filtered null values', () => {
    const submissionWithNullFields = { ...mockSubmission, programArea: null, collectedType: null, dataType: null };
    fixture.componentRef.setInput('submission', submissionWithNullFields);
    fixture.detectChanges();

    const attributes = component.currentSubmissionAttributes();
    expect(attributes).toBeDefined();
    expect(attributes).not.toBeNull();
    expect(Array.isArray(attributes)).toBe(true);
    expect(attributes!.length).toBeGreaterThan(0);
  });

  it('should have SubmissionReviewStatus enum available', () => {
    expect(component.SubmissionReviewStatus).toBe(SubmissionReviewStatus);
  });

  it('should load collection provider from store', () => {
    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();

    expect(component.collectionProvider()).toEqual(mockCollectionProvider);
  });

  it('should handle empty actions array', () => {
    const submissionWithEmptyActions = { ...mockSubmission, actions: [] };
    fixture.componentRef.setInput('submission', submissionWithEmptyActions);
    fixture.detectChanges();

    const currentAction = component.currentReviewAction();
    expect(currentAction).toBeNull();
  });
});
