import { provideStore, Store } from '@ngxs/store';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

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
              date: '2024-01-01T00:00:00Z',
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

    expect(item).toBeTruthy();
    expect(content?.innerHTML).toContain('formatted');
    expect(paginator).toBeTruthy();
  });

  it('dispatches on page change', () => {
    const dispatchSpy = store.dispatch as jest.Mock;
    dispatchSpy.mockClear();

    fixture.componentInstance.onPageChange({ page: 2 } as any);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(GetRegistrationActivityLogs));

    const action = dispatchSpy.mock.calls.at(-1)?.[0] as GetRegistrationActivityLogs;
    expect(action.page).toBe(3);
  });

  it('clears store on destroy', () => {
    const dispatchSpy = store.dispatch as jest.Mock;
    dispatchSpy.mockClear();

    fixture.destroy();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(ClearActivityLogsStore));
  });
});
