import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from '@osf/shared/components';
import { MOCK_STORE } from '@shared/mocks';

import { MyReviewingNavigationComponent, PreprintRecentActivityListComponent } from '../../components';
import { PreprintModerationSelectors } from '../../store/preprint-moderation';

import { MyPreprintReviewingComponent } from './my-preprint-reviewing.component';

describe('MyPreprintReviewingComponent', () => {
  let component: MyPreprintReviewingComponent;
  let fixture: ComponentFixture<MyPreprintReviewingComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintModerationSelectors.getPreprintProviders) return () => [];
      if (selector === PreprintModerationSelectors.arePreprintProviderLoading) return () => false;
      if (selector === PreprintModerationSelectors.getPreprintReviews) return () => [];
      if (selector === PreprintModerationSelectors.arePreprintReviewsLoading) return () => false;
      if (selector === PreprintModerationSelectors.getPreprintReviewsTotalCount) return () => 0;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [
        MyPreprintReviewingComponent,
        ...MockComponents(SubHeaderComponent, MyReviewingNavigationComponent, PreprintRecentActivityListComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPreprintReviewingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
