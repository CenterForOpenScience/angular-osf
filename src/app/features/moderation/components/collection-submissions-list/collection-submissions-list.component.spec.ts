import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_COLLECTION_SUBMISSION_WITH_GUID } from '@testing/mocks/submission.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { CollectionsModerationSelectors } from '../../store/collections-moderation';
import { CollectionSubmissionItemComponent } from '../collection-submission-item/collection-submission-item.component';

import { CollectionSubmissionsListComponent } from './collection-submissions-list.component';

describe('CollectionSubmissionsListComponent', () => {
  let component: CollectionSubmissionsListComponent;
  let fixture: ComponentFixture<CollectionSubmissionsListComponent>;

  const mockSubmissions = [MOCK_COLLECTION_SUBMISSION_WITH_GUID];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CollectionSubmissionsListComponent, MockComponent(CollectionSubmissionItemComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [{ selector: CollectionsModerationSelectors.getCollectionSubmissions, value: mockSubmissions }],
        }),
      ],
    });

    fixture = TestBed.createComponent(CollectionSubmissionsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load submissions from store', () => {
    fixture.detectChanges();

    expect(component.submissions()).toEqual(mockSubmissions);
  });

  it('should handle empty submissions list', () => {
    Object.defineProperty(component, 'submissions', {
      value: () => [],
      writable: true,
    });

    fixture.detectChanges();

    expect(component.submissions()).toEqual([]);
  });

  it('should handle empty submissions array', () => {
    Object.defineProperty(component, 'submissions', {
      value: () => [],
      writable: true,
    });

    fixture.detectChanges();

    expect(component.submissions()).toEqual([]);
    expect(component.submissions().length).toBe(0);
  });
});
