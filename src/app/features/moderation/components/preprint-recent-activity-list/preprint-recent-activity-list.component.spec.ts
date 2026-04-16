import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { MOCK_PREPRINT_REVIEW_ACTIONS } from '@testing/mocks/preprint-review-action.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintReviewActionModel } from '../../models';

import { PreprintRecentActivityListComponent } from './preprint-recent-activity-list.component';

describe('PreprintRecentActivityListComponent', () => {
  let component: PreprintRecentActivityListComponent;
  let fixture: ComponentFixture<PreprintRecentActivityListComponent>;

  const mockReviews: PreprintReviewActionModel[] = MOCK_PREPRINT_REVIEW_ACTIONS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintRecentActivityListComponent, ...MockComponents(IconComponent, CustomPaginatorComponent)],
      providers: [provideOSFCore()],
    });

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
    vi.spyOn(component.pageChanged, 'emit');
    const mockEvent = { page: 2, first: 10, rows: 10 };

    component.onPageChange(mockEvent);

    expect(component.first()).toBe(10);
    expect(component.rows()).toBe(10);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(3);
  });

  it('should not emit page change when page is undefined', () => {
    vi.spyOn(component.pageChanged, 'emit');
    const mockEvent = { page: undefined, first: 0, rows: 10 };

    component.onPageChange(mockEvent);

    expect(component.first()).toBe(0);
    expect(component.rows()).toBe(10);
    expect(component.pageChanged.emit).not.toHaveBeenCalled();
  });

  it('should fallback first to 0 when event.first is undefined', () => {
    vi.spyOn(component.pageChanged, 'emit');
    const mockEvent = { page: 0, first: undefined, rows: 10 };

    component.onPageChange(mockEvent);

    expect(component.first()).toBe(0);
    expect(component.rows()).toBe(10);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(1);
  });

  it('should keep current rows when event.rows is undefined', () => {
    vi.spyOn(component.pageChanged, 'emit');
    component.rows.set(25);
    const mockEvent = { page: 1, first: 25, rows: undefined };

    component.onPageChange(mockEvent);

    expect(component.first()).toBe(25);
    expect(component.rows()).toBe(25);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(2);
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
