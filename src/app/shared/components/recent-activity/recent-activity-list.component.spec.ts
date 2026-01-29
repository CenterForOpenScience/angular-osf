import { MockComponent } from 'ng-mocks';

import { PaginatorState } from 'primeng/paginator';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';

import { RecentActivityListComponent } from './recent-activity-list.component';

import {
  makeActivityLogWithDisplay,
  MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
} from '@testing/mocks/activity-log-with-display.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RecentActivityListComponent', () => {
  let component: RecentActivityListComponent;
  let fixture: ComponentFixture<RecentActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityListComponent, OSFTestingModule, MockComponent(CustomPaginatorComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivityListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('activityLogs', MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('totalCount', 10);
    fixture.componentRef.setInput('pageSize', 5);
    fixture.componentRef.setInput('firstIndex', 0);
    fixture.detectChanges();
  });

  it('should have input values set correctly', () => {
    expect(component.activityLogs()).toEqual(MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
    expect(component.isLoading()).toBe(false);
    expect(component.totalCount()).toBe(10);
    expect(component.pageSize()).toBe(5);
    expect(component.firstIndex()).toBe(0);
  });

  it('should emit pageChange event when onPageChange is called', () => {
    jest.spyOn(component.pageChange, 'emit');
    const mockEvent: PaginatorState = { page: 1, first: 5, rows: 5 };

    component.onPageChange(mockEvent);

    expect(component.pageChange.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle empty activity logs', () => {
    fixture.componentRef.setInput('activityLogs', []);
    fixture.componentRef.setInput('totalCount', 0);
    fixture.detectChanges();

    expect(component.activityLogs()).toEqual([]);
    expect(component.totalCount()).toBe(0);
  });

  it('should handle loading state', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should update inputs dynamically', () => {
    const newActivityLogs = [makeActivityLogWithDisplay({ id: 'log3', action: 'delete' })];

    fixture.componentRef.setInput('activityLogs', newActivityLogs);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('totalCount', 50);
    fixture.componentRef.setInput('pageSize', 20);
    fixture.componentRef.setInput('firstIndex', 20);
    fixture.detectChanges();

    expect(component.activityLogs()).toEqual(newActivityLogs);
    expect(component.isLoading()).toBe(true);
    expect(component.totalCount()).toBe(50);
    expect(component.pageSize()).toBe(20);
    expect(component.firstIndex()).toBe(20);
  });

  it('should handle PaginatorState with undefined or null values', () => {
    jest.spyOn(component.pageChange, 'emit');
    const undefinedEvent: PaginatorState = { page: undefined, first: 0, rows: 5 };
    const nullEvent: PaginatorState = { page: null as any, first: null as any, rows: 5 };

    component.onPageChange(undefinedEvent);
    component.onPageChange(nullEvent);

    expect(component.pageChange.emit).toHaveBeenCalledWith(undefinedEvent);
    expect(component.pageChange.emit).toHaveBeenCalledWith(nullEvent);
    expect(component.pageChange.emit).toHaveBeenCalledTimes(2);
  });

  it('should handle activity logs without formattedActivity', () => {
    const logsWithoutFormatted = [
      makeActivityLogWithDisplay({ id: 'log4', action: 'remove', formattedActivity: undefined }),
    ];

    fixture.componentRef.setInput('activityLogs', logsWithoutFormatted);
    fixture.detectChanges();

    expect(component.activityLogs()).toEqual(logsWithoutFormatted);
    expect(component.activityLogs()[0].formattedActivity).toBeUndefined();
  });

  it('should handle activity logs with different action types', () => {
    const logsWithDifferentActions = [
      makeActivityLogWithDisplay({ id: 'log5', action: 'add', formattedActivity: 'Added activity' }),
      makeActivityLogWithDisplay({ id: 'log6', action: 'remove', formattedActivity: 'Removed activity' }),
    ];

    fixture.componentRef.setInput('activityLogs', logsWithDifferentActions);
    fixture.detectChanges();

    expect(component.activityLogs()).toEqual(logsWithDifferentActions);
    expect(component.activityLogs()[0].action).toBe('add');
    expect(component.activityLogs()[1].action).toBe('remove');
  });

  it('should handle multiple consecutive page changes', () => {
    jest.spyOn(component.pageChange, 'emit');
    const event1: PaginatorState = { page: 0, first: 0, rows: 5 };
    const event2: PaginatorState = { page: 1, first: 5, rows: 5 };
    const event3: PaginatorState = { page: 2, first: 10, rows: 5 };

    component.onPageChange(event1);
    component.onPageChange(event2);
    component.onPageChange(event3);

    expect(component.pageChange.emit).toHaveBeenCalledTimes(3);
    expect(component.pageChange.emit).toHaveBeenNthCalledWith(1, event1);
    expect(component.pageChange.emit).toHaveBeenNthCalledWith(2, event2);
    expect(component.pageChange.emit).toHaveBeenNthCalledWith(3, event3);
  });
});
