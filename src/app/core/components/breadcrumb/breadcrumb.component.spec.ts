import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, UrlSegment } from '@angular/router';

import { ProviderSelectors } from '@core/store/provider';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { InstitutionsSearchSelectors } from '@shared/stores/institutions-search';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let routerBuilder: RouterMockBuilder;

  const createSnapshot = (
    paths: string[],
    params: Record<string, string> = {},
    firstChild?: ActivatedRouteSnapshot
  ): ActivatedRouteSnapshot =>
    ({
      url: paths.map((path) => new UrlSegment(path, {})),
      params,
      firstChild: firstChild ?? null,
    }) as unknown as ActivatedRouteSnapshot;

  function setup(overrides?: {
    providerName?: string | null;
    institutionName?: string | null;
    institutionDashboardName?: string | null;
    routeSnapshot?: ActivatedRouteSnapshot;
    leafData?: Record<string, unknown>;
  }) {
    const leafData = overrides?.leafData ?? { skipBreadcrumbs: false };
    const activatedRouteChain = ActivatedRouteMockBuilder.create()
      .withData({})
      .withFirstChild((child) => {
        child.withData(leafData);
      });
    const activatedRouteBuilt = activatedRouteChain.build();

    const defaultSnapshot = createSnapshot(
      ['preprints'],
      {},
      createSnapshot(['osf'], { providerId: 'osf' }, createSnapshot(['new-registration']))
    );

    const routeRootSnapshot = overrides?.routeSnapshot ?? defaultSnapshot;
    const activatedRouteMock = {
      ...activatedRouteBuilt,
      root: { snapshot: routeRootSnapshot } as ActivatedRoute,
      firstChild: activatedRouteBuilt.firstChild,
      snapshot: activatedRouteBuilt.snapshot,
    } as unknown as ActivatedRoute;
    routerBuilder = RouterMockBuilder.create().withUrl('/test');

    TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerBuilder.build()),
        provideMockStore({
          signals: [
            {
              selector: ProviderSelectors.getCurrentProvider,
              value: overrides?.providerName ? { name: overrides.providerName } : null,
            },
            {
              selector: InstitutionsSearchSelectors.getInstitution,
              value: overrides?.institutionName ? { name: overrides.institutionName } : null,
            },
            {
              selector: InstitutionsAdminSelectors.getInstitution,
              value: overrides?.institutionDashboardName ? { name: overrides.institutionDashboardName } : null,
            },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should show breadcrumb by default when skipBreadcrumbs is not true', () => {
    setup({ leafData: { skipBreadcrumbs: false } });
    expect(component.showBreadcrumb()).toBe(true);
  });

  it('should hide breadcrumb when route data has skipBreadcrumbs true', () => {
    setup({ leafData: { skipBreadcrumbs: true } });
    expect(component.showBreadcrumb()).toBe(false);
  });

  it('should replace provider id segment with provider name', () => {
    setup({ providerName: 'OSF Preprints' });
    expect(component.breadcrumbs()).toEqual(['preprints', 'OSF Preprints', 'new registration']);
  });

  it('should replace institution id segment with institution name', () => {
    const institutionSnapshot = createSnapshot(
      ['institutions'],
      {},
      createSnapshot(['inst-1'], { institutionId: 'inst-1' }, createSnapshot(['users']))
    );
    setup({ institutionName: 'My Institution', routeSnapshot: institutionSnapshot });
    expect(component.breadcrumbs()).toEqual(['institutions', 'My Institution', 'users']);
  });

  it('should fallback to institution dashboard name when institution selector is empty', () => {
    const institutionSnapshot = createSnapshot(
      ['institutions'],
      {},
      createSnapshot(['inst-1'], { institutionId: 'inst-1' }, createSnapshot(['dashboard']))
    );
    setup({
      institutionName: null,
      institutionDashboardName: 'Dashboard Institution',
      routeSnapshot: institutionSnapshot,
    });
    expect(component.breadcrumbs()).toEqual(['institutions', 'Dashboard Institution', 'dashboard']);
  });
});
