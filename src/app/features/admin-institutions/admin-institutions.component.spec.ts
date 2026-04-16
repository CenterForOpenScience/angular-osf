import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { Primitive } from '@osf/shared/helpers/types.helper';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { AdminInstitutionsComponent } from './admin-institutions.component';
import { AdminInstitutionResourceTab } from './enums';
import { FetchInstitutionById, InstitutionsAdminSelectors } from './store';

describe('AdminInstitutionsComponent', () => {
  let component: AdminInstitutionsComponent;
  let fixture: ComponentFixture<AdminInstitutionsComponent>;
  let store: Store;
  let route: Partial<ActivatedRoute>;
  let router: RouterMockType;

  function setup({
    institutionId = 'inst-1',
    selectedRouteTab,
  }: {
    institutionId?: string;
    selectedRouteTab?: AdminInstitutionResourceTab;
  } = {}) {
    route = ActivatedRouteMockBuilder.create().withParams({ institutionId }).build();
    (route.snapshot as { firstChild?: { routeConfig?: { path?: string } } }).firstChild = selectedRouteTab
      ? { routeConfig: { path: selectedRouteTab } }
      : undefined;
    router = RouterMockBuilder.create().withUrl('/admin-institutions/inst-1/summary').build();

    TestBed.configureTestingModule({
      imports: [AdminInstitutionsComponent, ...MockComponents(LoadingSpinnerComponent, SelectComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, router),
        provideMockStore({
          signals: [
            { selector: InstitutionsAdminSelectors.getInstitution, value: null },
            { selector: InstitutionsAdminSelectors.getInstitutionLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AdminInstitutionsComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch fetchInstitution on init when institutionId exists', () => {
    setup({ institutionId: 'inst-123' });
    (store.dispatch as Mock).mockClear();

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutionById('inst-123'));
  });

  it('should not dispatch fetchInstitution on init when institutionId missing', () => {
    setup({ institutionId: '' });
    (store.dispatch as Mock).mockClear();

    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchInstitutionById));
  });

  it('should set selectedTab from first child route path', () => {
    setup({ selectedRouteTab: AdminInstitutionResourceTab.Users });

    component.ngOnInit();

    expect(component.selectedTab).toBe(AdminInstitutionResourceTab.Users);
  });

  it('should default selectedTab to summary when first child path missing', () => {
    setup({ selectedRouteTab: undefined });

    component.ngOnInit();

    expect(component.selectedTab).toBe(AdminInstitutionResourceTab.Summary);
  });

  it('should update selectedTab and navigate on tab change', () => {
    setup();

    component.onTabChange(AdminInstitutionResourceTab.Projects as Primitive);

    expect(component.selectedTab).toBe(AdminInstitutionResourceTab.Projects);
    expect(router.navigate).toHaveBeenCalledWith(
      [AdminInstitutionResourceTab.Projects],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });

  it('should not navigate when selected tab is falsy', () => {
    setup();

    component.onTabChange('' as Primitive);

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
