import { NgxsModule, Store } from '@ngxs/store';

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
      imports: [NgxsModule.forRoot([ActivityLogsState]), RegistrationRecentActivityComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'reg123' } }, parent: null } }],
    }).compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(RegistrationRecentActivityComponent);
    fixture.detectChanges();
  });

  it('creates and dispatches initial registration logs fetch', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(GetRegistrationActivityLogs));
    const action = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0] as GetRegistrationActivityLogs;
    expect(action.registrationId).toBe('reg123');
    expect(action.page).toBe('1');
  });

  it('dispatches on page change', () => {
    (store.dispatch as jasmine.Spy).calls.reset();
    fixture.componentInstance.onPageChange({ page: 2 } as any);
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(GetRegistrationActivityLogs));
    const action = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0] as GetRegistrationActivityLogs;
    expect(action.page).toBe('3');
  });

  it('clears store on destroy', () => {
    (store.dispatch as jasmine.Spy).calls.reset();
    fixture.destroy();
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(ClearActivityLogsStore));
  });
});
