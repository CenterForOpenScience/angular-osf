import { Store } from '@ngxs/store';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsSelectors, ClearActivityLogs } from '@osf/shared/stores/activity-logs';

import { ProjectRecentActivityComponent } from './project-recent-activity.component';

import { MOCK_ACTIVITY_LOGS_WITH_DISPLAY } from '@testing/mocks/activity-log-with-display.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ProjectRecentActivityComponent', () => {
  let component: ProjectRecentActivityComponent;
  let fixture: ComponentFixture<ProjectRecentActivityComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectRecentActivityComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ActivityLogsSelectors.getActivityLogs, value: [] },
            { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 0 },
            { selector: ActivityLogsSelectors.getActivityLogsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ProjectRecentActivityComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with default values', () => {
    expect(component.pageSize()).toBe(5);
    expect(component.currentPage()).toBe(1);
    expect(component.firstIndex()).toBe(0);
  });

  it('should dispatch GetActivityLogs when projectId is provided', () => {
    fixture.componentRef.setInput('projectId', 'project123');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'project123',
        resourceType: CurrentResourceType.Projects,
        page: 1,
        pageSize: 5,
      })
    );
  });

  it('should not dispatch when projectId is not provided', () => {
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch GetActivityLogs when currentPage changes', () => {
    fixture.componentRef.setInput('projectId', 'project123');
    fixture.detectChanges();

    (store.dispatch as jest.Mock).mockClear();

    component.currentPage.set(2);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'project123',
        resourceType: CurrentResourceType.Projects,
        page: 2,
        pageSize: 5,
      })
    );
  });

  it('should update currentPage and dispatch on page change', () => {
    fixture.componentRef.setInput('projectId', 'project123');
    fixture.detectChanges();

    (store.dispatch as jest.Mock).mockClear();

    component.onPageChange({ page: 1 } as any);
    fixture.detectChanges();

    expect(component.currentPage()).toBe(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
      })
    );
  });

  it('should not update currentPage when page is undefined', () => {
    fixture.componentRef.setInput('projectId', 'project123');
    fixture.detectChanges();

    const initialPage = component.currentPage();
    component.onPageChange({} as any);

    expect(component.currentPage()).toBe(initialPage);
  });

  it('should compute firstIndex correctly', () => {
    component.currentPage.set(1);
    expect(component.firstIndex()).toBe(0);

    component.currentPage.set(2);
    expect(component.firstIndex()).toBe(5);

    component.currentPage.set(3);
    expect(component.firstIndex()).toBe(10);
  });

  it('should clear store on destroy', () => {
    fixture.componentRef.setInput('projectId', 'project123');
    fixture.detectChanges();

    (store.dispatch as jest.Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearActivityLogs));
  });

  it('should return activity logs from selector', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProjectRecentActivityComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ActivityLogsSelectors.getActivityLogs, value: MOCK_ACTIVITY_LOGS_WITH_DISPLAY },
            { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 2 },
            { selector: ActivityLogsSelectors.getActivityLogsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectRecentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.activityLogs()).toEqual(MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
  });

  it('should return totalCount from selector', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProjectRecentActivityComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ActivityLogsSelectors.getActivityLogs, value: [] },
            { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 10 },
            { selector: ActivityLogsSelectors.getActivityLogsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectRecentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.totalCount()).toBe(10);
  });

  it('should return isLoading from selector', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProjectRecentActivityComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: ActivityLogsSelectors.getActivityLogs, value: [] },
            { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 0 },
            { selector: ActivityLogsSelectors.getActivityLogsLoading, value: true },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectRecentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });
});
