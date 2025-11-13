import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { PreprintReviewActionModel } from '../../models';

import { PreprintRecentActivityListComponent } from './preprint-recent-activity-list.component';

import { MOCK_PREPRINT_REVIEW_ACTIONS } from '@testing/mocks/preprint-review-action.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintRecentActivityListComponent', () => {
  let component: PreprintRecentActivityListComponent;
  let fixture: ComponentFixture<PreprintRecentActivityListComponent>;

  const mockReviews: PreprintReviewActionModel[] = MOCK_PREPRINT_REVIEW_ACTIONS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintRecentActivityListComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, CustomPaginatorComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintRecentActivityListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reviews', mockReviews);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('totalCount', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input values', () => {
    expect(component.reviews()).toEqual(mockReviews);
    expect(component.isLoading()).toBe(false);
    expect(component.totalCount()).toBe(1);
  });

  it('should have default first value', () => {
    expect(component.first()).toBe(0);
  });

  it('should have constants defined', () => {
    expect(component.reviewStatusIcon).toBeDefined();
    expect(component.preprintReviewStatus).toBeDefined();
  });

  it('should emit page change event', () => {
    jest.spyOn(component.pageChanged, 'emit');
    const mockEvent = { page: 2, first: 10, rows: 10 };

    component.onPageChange(mockEvent);

    expect(component.pageChanged.emit).toHaveBeenCalledWith(2);
  });

  it('should emit page 1 when page is undefined', () => {
    jest.spyOn(component.pageChanged, 'emit');
    const mockEvent = { page: undefined, first: 0, rows: 10 };

    component.onPageChange(mockEvent);

    expect(component.pageChanged.emit).toHaveBeenCalledWith(1);
  });

  it('should accept custom input values', () => {
    const customReviews = [
      ...mockReviews,
      {
        id: '2',
        fromState: 'pending',
        toState: 'approved',
        dateModified: '2023-01-02',
        creator: { id: 'user-2', name: 'Jane Doe' },
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
    fixture.componentRef.setInput('reviews', customReviews);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('totalCount', 2);

    expect(component.reviews()).toEqual(customReviews);
    expect(component.isLoading()).toBe(true);
    expect(component.totalCount()).toBe(2);
  });
});
