import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivityListComponent } from '@osf/shared/components/recent-activity/recent-activity-list.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsSelectors, ClearActivityLogs, GetActivityLogs } from '@osf/shared/stores/activity-logs';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ProjectRecentActivityComponent } from './project-recent-activity.component';

describe('ProjectRecentActivityComponent', () => {
  let component: ProjectRecentActivityComponent;
  let fixture: ComponentFixture<ProjectRecentActivityComponent>;
  let store: Store;

  function setup(platformId: 'browser' | 'server' = 'browser') {
    TestBed.configureTestingModule({
      imports: [ProjectRecentActivityComponent, MockComponent(RecentActivityListComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(PLATFORM_ID, platformId),
        provideMockStore({
          signals: [
            { selector: ActivityLogsSelectors.getActivityLogs, value: [] },
            { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 0 },
            { selector: ActivityLogsSelectors.getActivityLogsLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectRecentActivityComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should dispatch activity logs request when projectId is set', () => {
    setup();
    fixture.componentRef.setInput('projectId', 'project-1');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new GetActivityLogs('project-1', CurrentResourceType.Projects, 1, 5));
  });

  it('should compute firstIndex from current page and page size', () => {
    setup();
    fixture.detectChanges();
    component.currentPage.set(3);

    expect(component.firstIndex()).toBe(10);
  });

  it('should update current page on page change and fetch logs for new page', () => {
    setup();
    fixture.componentRef.setInput('projectId', 'project-1');
    fixture.detectChanges();
    vi.mocked(store.dispatch).mockClear();

    component.onPageChange({ page: 2, rows: 5 });
    fixture.detectChanges();

    expect(component.currentPage()).toBe(3);
    expect(store.dispatch).toHaveBeenCalledWith(new GetActivityLogs('project-1', CurrentResourceType.Projects, 3, 5));
  });

  it('should not change page when paginator event page is undefined', () => {
    setup();
    fixture.detectChanges();
    component.currentPage.set(2);

    component.onPageChange({ page: undefined, rows: 5 });

    expect(component.currentPage()).toBe(2);
  });

  it('should clear activity logs on destroy in browser', () => {
    setup('browser');
    fixture.detectChanges();
    vi.mocked(store.dispatch).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearActivityLogs());
  });

  it('should not clear activity logs on destroy on server', () => {
    setup('server');
    fixture.detectChanges();
    vi.mocked(store.dispatch).mockClear();

    fixture.destroy();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ClearActivityLogs));
  });
});
