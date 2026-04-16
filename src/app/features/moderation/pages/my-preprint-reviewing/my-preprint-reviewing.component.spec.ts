import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { MOCK_PREPRINT_PROVIDER_MODERATION_INFO } from '@testing/mocks/preprint-provider-moderation-info.mock';
import { MOCK_PREPRINT_REVIEW_ACTIONS } from '@testing/mocks/preprint-review-action.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { MyReviewingNavigationComponent } from '../../components/my-reviewing-navigation/my-reviewing-navigation.component';
import { PreprintRecentActivityListComponent } from '../../components/preprint-recent-activity-list/preprint-recent-activity-list.component';
import { PreprintModerationSelectors } from '../../store/preprint-moderation';

import { MyPreprintReviewingComponent } from './my-preprint-reviewing.component';

describe('MyPreprintReviewingComponent', () => {
  let component: MyPreprintReviewingComponent;
  let fixture: ComponentFixture<MyPreprintReviewingComponent>;

  const mockPreprintProviders = [MOCK_PREPRINT_PROVIDER_MODERATION_INFO];
  const mockPreprintReviews = MOCK_PREPRINT_REVIEW_ACTIONS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MyPreprintReviewingComponent,
        ...MockComponents(SubHeaderComponent, PreprintRecentActivityListComponent, MyReviewingNavigationComponent),
      ],
      providers: [
        provideOSFCore(),
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
    });

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
