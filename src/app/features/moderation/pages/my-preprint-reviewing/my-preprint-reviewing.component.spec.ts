import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MyReviewingNavigationComponent,
  PreprintRecentActivityListComponent,
} from '@osf/features/moderation/components';
import { SubHeaderComponent } from '@osf/shared/components';

import { PreprintModerationSelectors } from '../../store/preprint-moderation';

import { MyPreprintReviewingComponent } from './my-preprint-reviewing.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MyPreprintReviewingComponent', () => {
  let component: MyPreprintReviewingComponent;
  let fixture: ComponentFixture<MyPreprintReviewingComponent>;

  const mockPreprintProviders = [
    {
      id: 'provider-1',
      name: 'Test Provider 1',
      submissionCount: 10,
      reviewsCommentsAnonymous: true,
      reviewsCommentsPrivate: false,
      reviewsWorkflow: 'pre_moderation',
      supportEmail: 'support@test1.com',
    },
    {
      id: 'provider-2',
      name: 'Test Provider 2',
      submissionCount: 5,
      reviewsCommentsAnonymous: false,
      reviewsCommentsPrivate: true,
      reviewsWorkflow: 'post_moderation',
      supportEmail: 'support@test2.com',
    },
  ];

  const mockPreprintReviews = [
    {
      id: '1',
      fromState: 'pending',
      toState: 'accepted',
      dateModified: '2023-01-01',
      creator: {
        id: 'user-1',
        name: 'John Doe',
      },
      preprint: {
        id: 'preprint-1',
        name: 'Test Preprint',
      },
      provider: {
        id: 'provider-1',
        name: 'Test Provider',
      },
    },
    {
      id: '2',
      fromState: 'pending',
      toState: 'rejected',
      dateModified: '2023-01-02',
      creator: {
        id: 'user-2',
        name: 'Jane Smith',
      },
      preprint: {
        id: 'preprint-2',
        name: 'Test Preprint 2',
      },
      provider: {
        id: 'provider-2',
        name: 'Test Provider 2',
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyPreprintReviewingComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, PreprintRecentActivityListComponent, MyReviewingNavigationComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: PreprintModerationSelectors.getPreprintProviders, value: mockPreprintProviders },
            { selector: PreprintModerationSelectors.arePreprintProviderLoading, value: false },
            { selector: PreprintModerationSelectors.getPreprintReviews, value: mockPreprintReviews },
            { selector: PreprintModerationSelectors.arePreprintReviewsLoading, value: false },
            { selector: PreprintModerationSelectors.getPreprintReviewsTotalCount, value: 2 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPreprintReviewingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.preprintProviders()).toEqual(mockPreprintProviders);
    expect(component.isPreprintProvidersLoading()).toBe(false);
    expect(component.preprintReviews()).toEqual(mockPreprintReviews);
    expect(component.isReviewsLoading()).toBe(false);
    expect(component.preprintReviewsTotalCount()).toBe(2);
  });

  it('should handle page change', () => {
    expect(() => component.pageChanged(2)).not.toThrow();
  });

  it('should handle page change with different page numbers', () => {
    const pages = [1, 2, 3, 5, 10];

    pages.forEach((page) => {
      expect(() => component.pageChanged(page)).not.toThrow();
    });
  });
});
