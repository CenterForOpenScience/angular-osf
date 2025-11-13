import { provideStore, Store } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivityLogDisplayService } from '@osf/shared/services/activity-logs/activity-log-display.service';
import { ClearActivityLogsStore, GetRegistrationActivityLogs } from '@shared/stores/activity-logs';
import { ActivityLogsState } from '@shared/stores/activity-logs/activity-logs.state';

import { RegistrationRecentActivityComponent } from './registration-recent-activity.component';

describe('RegistrationRecentActivityComponent', () => {
  let fixture: ComponentFixture<RegistrationRecentActivityComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationRecentActivityComponent],
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
        {
          provide: ActivityLogDisplayService,
          useValue: { getActivityDisplay: jest.fn(() => '<b>formatted</b>') },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'reg123' } }, parent: null } },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(RegistrationRecentActivityComponent);
    fixture.detectChanges();
  });

  it('dispatches initial registration logs fetch', () => {
    const dispatchSpy = store.dispatch as jest.Mock;
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(GetRegistrationActivityLogs));
    const action = dispatchSpy.mock.calls.at(-1)?.[0] as GetRegistrationActivityLogs;
    expect(action.registrationId).toBe('reg123');
    expect(action.page).toBe(1);
  });

  it('renders empty state when no logs and not loading', () => {
    store.reset({
      activityLogs: {
        activityLogs: { data: [], isLoading: false, error: null, totalCount: 0 },
      },
    } as any);
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('[data-test="recent-activity-empty"]');
    expect(empty).toBeTruthy();
  });

  it('renders item & paginator when logs exist and totalCount > pageSize', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [
            {
              id: 'log1',
              date: '2024-01-01T12:34:00Z',
              formattedActivity: '<b>formatted</b>',
            },
          ],
          isLoading: false,
          error: null,
          totalCount: 25,
        },
      },
    } as any);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('[data-test="recent-activity-item"]');
    const content = fixture.nativeElement.querySelector('[data-test="recent-activity-item-content"]');
    const paginator = fixture.nativeElement.querySelector('[data-test="recent-activity-paginator"]');
    const dateText = fixture.nativeElement.querySelector('[data-test="recent-activity-item-date"]')?.textContent ?? '';

    expect(item).toBeTruthy();
    expect(content?.innerHTML).toContain('formatted');
    expect(paginator).toBeTruthy();
    expect(dateText).toMatch(/\w{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M/);
  });

  it('does not render paginator when totalCount <= pageSize', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [{ id: 'log1', date: '2024-01-01T12:34:00Z', formattedActivity: '<b>formatted</b>' }],
          isLoading: false,
          error: null,
          totalCount: 10,
        },
      },
    } as any);
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('[data-test="recent-activity-paginator"]');
    expect(paginator).toBeFalsy();
  });

  it('dispatches on page change', () => {
    const dispatchSpy = store.dispatch as jest.Mock;
    dispatchSpy.mockClear();

    fixture.componentInstance.onPageChange({ page: 2 } as any);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(GetRegistrationActivityLogs));

    const action = dispatchSpy.mock.calls.at(-1)?.[0] as GetRegistrationActivityLogs;
    expect(action.page).toBe(3);
  });

  it('does not dispatch when page change event has undefined page', () => {
    const dispatchSpy = store.dispatch as jest.Mock;
    dispatchSpy.mockClear();

    fixture.componentInstance.onPageChange({} as any);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('computes firstIndex correctly after page change', () => {
    fixture.componentInstance.onPageChange({ page: 1 } as any);
    const firstIndex = (fixture.componentInstance as any)['firstIndex']();
    expect(firstIndex).toBe(10);
  });

  it('clears store on destroy', () => {
    const dispatchSpy = store.dispatch as jest.Mock;
    dispatchSpy.mockClear();

    fixture.destroy();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(ClearActivityLogsStore));
  });

  it('shows skeleton while loading', () => {
    store.reset({
      activityLogs: {
        activityLogs: { data: [], isLoading: true, error: null, totalCount: 0 },
      },
    } as any);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-test="recent-activity-skeleton"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-test="recent-activity-list"]')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('[data-test="recent-activity-paginator"]')).toBeFalsy();
  });

  it('renders expected ARIA roles/labels', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [{ id: 'log1', date: '2024-01-01T12:34:00Z', formattedActivity: '<b>formatted</b>' }],
          isLoading: false,
          error: null,
          totalCount: 1,
        },
      },
    } as any);
    fixture.detectChanges();

    const region = fixture.nativeElement.querySelector('[role="region"]');
    const heading = fixture.nativeElement.querySelector('#recent-activity-title');
    const list = fixture.nativeElement.querySelector('[role="list"]');
    const listitem = fixture.nativeElement.querySelector('[role="listitem"]');

    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-labelledby')).toBe('recent-activity-title');
    expect(heading).toBeTruthy();
    expect(list).toBeTruthy();
    expect(listitem).toBeTruthy();
  });
});
