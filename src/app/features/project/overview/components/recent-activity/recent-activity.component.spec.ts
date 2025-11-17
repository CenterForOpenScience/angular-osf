import { provideStore, Store } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { ActivityLogDisplayService } from '@osf/shared/services/activity-logs/activity-log-display.service';
import { GetActivityLogs } from '@shared/stores/activity-logs';
import { ActivityLogsState } from '@shared/stores/activity-logs/activity-logs.state';

import { RecentActivityComponent } from './recent-activity.component';

describe.skip('RecentActivityComponent', () => {
  let fixture: ComponentFixture<RecentActivityComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityComponent, MockComponent(CustomPaginatorComponent)],
      providers: [
        provideStore([ActivityLogsState]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: TranslateService,
          useValue: {
            instant: (k: string) => k,
            get: () => of(''),
            stream: () => of(''),
            onLangChange: of({}),
            onDefaultLangChange: of({}),
            onTranslationChange: of({}),
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'proj123' } }, parent: null } },
        { provide: ActivityLogDisplayService, useValue: { getActivityDisplay: jest.fn().mockReturnValue('FMT') } },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.reset({
      activityLogs: {
        activityLogs: { data: [], isLoading: false, error: null, totalCount: 0 },
      },
    } as any);

    fixture = TestBed.createComponent(RecentActivityComponent);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('formats activity logs using ActivityLogDisplayService', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [{ id: 'log1', date: '2024-01-01T00:00:00Z' }],
          isLoading: false,
          error: null,
          totalCount: 1,
        },
      },
    } as any);

    fixture.detectChanges();

    const formatted = fixture.componentInstance.formattedActivityLogs();
    expect(formatted.length).toBe(1);
    expect(formatted[0].formattedActivity).toBe('FMT');
  });

  it('dispatches GetActivityLogs with numeric page and pageSize on page change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.componentInstance.onPageChange({ page: 2 } as any);

    expect(dispatchSpy).toHaveBeenCalled();
    const action = dispatchSpy.mock.calls.at(-1)?.[0] as GetActivityLogs;

    expect(action).toBeInstanceOf(GetActivityLogs);
    expect(action.projectId).toBe('proj123');
    expect(action.page).toBe(3);
    expect(action.pageSize).toBe(10);
  });

  it('computes firstIndex correctly', () => {
    fixture.componentInstance['currentPage'].set(3);
    expect(fixture.componentInstance['firstIndex']()).toBe(20);
  });
});
