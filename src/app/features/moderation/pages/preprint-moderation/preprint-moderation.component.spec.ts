import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { PreprintModerationTab } from '../../enums';
import { GetPreprintProvider } from '../../store/preprint-moderation';

import { PreprintModerationComponent } from './preprint-moderation.component';

describe('PreprintModerationComponent', () => {
  let component: PreprintModerationComponent;
  let fixture: ComponentFixture<PreprintModerationComponent>;
  let store: Store;
  let dispatchMock: Mock;
  let mockRouter: RouterMockType;

  interface SetupOptions {
    providerId?: string;
    tab?: PreprintModerationTab;
  }

  function setup(options: SetupOptions = {}) {
    const { providerId = 'provider-1', tab = PreprintModerationTab.Submissions } = options;
    const routeBuilder = ActivatedRouteMockBuilder.create().withFirstChild((child) => child.withData({ tab }));

    if (providerId) {
      routeBuilder.withParams({ providerId });
    }

    const route = routeBuilder.build() as Partial<ActivatedRoute>;
    mockRouter = RouterMockBuilder.create().withUrl('/preprints/provider-1/moderation/submissions').build();

    TestBed.configureTestingModule({
      imports: [PreprintModerationComponent, ...MockComponents(SubHeaderComponent, SelectComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, of(true)),
      ],
    });

    fixture = TestBed.createComponent(PreprintModerationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should expose static defaults', () => {
    setup();

    expect(component.resourceType).toBe(ResourceType.Preprint);
    expect(component.selectedTab).toBe(PreprintModerationTab.Submissions);
    expect(component.tabOptions.length).toBeGreaterThan(0);
  });

  it('should initialize selectedTab from first child route data', () => {
    setup({ tab: PreprintModerationTab.WithdrawalRequests });

    component.ngOnInit();

    expect(component.selectedTab).toBe(PreprintModerationTab.WithdrawalRequests);
  });

  it('should navigate to not-found when providerId is missing', () => {
    setup({ providerId: '' });
    dispatchMock.mockClear();

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
    expect(dispatchMock).not.toHaveBeenCalledWith(expect.any(GetPreprintProvider));
  });

  it('should dispatch GetPreprintProvider on init when providerId exists', () => {
    setup({ providerId: 'provider-1' });
    dispatchMock.mockClear();

    component.ngOnInit();

    expect(dispatchMock).toHaveBeenCalledWith(new GetPreprintProvider('provider-1'));
  });

  it('should update selected tab and navigate relative to route on tab change', () => {
    setup();

    component.onTabChange(PreprintModerationTab.Moderators);

    expect(component.selectedTab).toBe(PreprintModerationTab.Moderators);
    expect(mockRouter.navigate).toHaveBeenCalledWith([PreprintModerationTab.Moderators], {
      relativeTo: component.route,
    });
  });
});
