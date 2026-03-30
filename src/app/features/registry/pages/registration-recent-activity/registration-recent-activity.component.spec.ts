import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { PaginatorState } from 'primeng/paginator';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RecentActivityListComponent } from '@osf/shared/components/recent-activity/recent-activity-list.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsSelectors, ClearActivityLogs } from '@osf/shared/stores/activity-logs';

import { RegistrationRecentActivityComponent } from './registration-recent-activity.component';

import { MOCK_ACTIVITY_LOGS_WITH_DISPLAY } from '@testing/mocks/activity-log-with-display.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

function setup(overrides: BaseSetupOverrides = {}) {
  const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: 'reg123' });
  if (overrides.hasParent === false) routeBuilder.withNoParent();
  const mockRoute = routeBuilder.build();

  const defaultSignals = [
    { selector: ActivityLogsSelectors.getActivityLogs, value: [] },
    { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 0 },
    { selector: ActivityLogsSelectors.getActivityLogsLoading, value: false },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [RegistrationRecentActivityComponent, MockComponent(RecentActivityListComponent)],
    providers: [provideOSFCore(), MockProvider(ActivatedRoute, mockRoute), provideMockStore({ signals })],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistrationRecentActivityComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, store };
}

describe('RegistrationRecentActivityComponent', () => {
  it('should initialize with default values', () => {
    const { component } = setup();

    expect(component.pageSize).toBe(10);
    expect(component.currentPage()).toBe(1);
    expect(component.firstIndex()).toBe(0);
  });

  it('should dispatch GetActivityLogs when registrationId is available', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'reg123',
        resourceType: CurrentResourceType.Registrations,
        page: 1,
        pageSize: 10,
      })
    );
  });

  it('should not dispatch when registrationId is not available', () => {
    const { store } = setup({ hasParent: false });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch GetActivityLogs when currentPage changes', () => {
    const { fixture, component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();

    component.currentPage.set(2);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'reg123',
        resourceType: CurrentResourceType.Registrations,
        page: 2,
        pageSize: 10,
      })
    );
  });

  it('should update currentPage and dispatch on page change', () => {
    const { fixture, component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();

    component.onPageChange({ page: 1 } as PaginatorState);
    fixture.detectChanges();

    expect(component.currentPage()).toBe(2);
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
  });

  it('should not update currentPage when page is undefined', () => {
    const { component } = setup();

    const initialPage = component.currentPage();
    component.onPageChange({} as PaginatorState);

    expect(component.currentPage()).toBe(initialPage);
  });

  it('should compute firstIndex correctly', () => {
    const { component } = setup();

    component.currentPage.set(1);
    expect(component.firstIndex()).toBe(0);

    component.currentPage.set(2);
    expect(component.firstIndex()).toBe(10);

    component.currentPage.set(3);
    expect(component.firstIndex()).toBe(20);
  });

  it('should clear store on destroy', () => {
    const { fixture, store } = setup();

    (store.dispatch as jest.Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearActivityLogs));
  });

  it('should return selector values', () => {
    const { component } = setup({
      selectorOverrides: [
        { selector: ActivityLogsSelectors.getActivityLogs, value: MOCK_ACTIVITY_LOGS_WITH_DISPLAY },
        { selector: ActivityLogsSelectors.getActivityLogsTotalCount, value: 15 },
        { selector: ActivityLogsSelectors.getActivityLogsLoading, value: true },
      ],
    });

    expect(component.activityLogs()).toEqual(MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
    expect(component.totalCount()).toBe(15);
    expect(component.isLoading()).toBe(true);
  });
});
