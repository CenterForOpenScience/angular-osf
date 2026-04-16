import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { GetCollectionProvider } from '@osf/shared/stores/collections';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { CollectionModerationTab } from '../../enums';

import { CollectionModerationComponent } from './collection-moderation.component';

describe('CollectionModerationComponent', () => {
  let component: CollectionModerationComponent;
  let fixture: ComponentFixture<CollectionModerationComponent>;
  let store: Store;
  let dispatchMock: Mock;
  let mockRouter: RouterMockType;

  interface SetupOptions {
    providerId?: string;
    tab?: CollectionModerationTab;
  }

  function setup(options: SetupOptions = {}) {
    const { providerId = 'provider-1', tab = CollectionModerationTab.AllItems } = options;
    const routeBuilder = ActivatedRouteMockBuilder.create().withFirstChild((child) => child.withData({ tab }));

    if (providerId) {
      routeBuilder.withParams({ providerId });
    }

    const route = routeBuilder.build() as Partial<ActivatedRoute>;
    mockRouter = RouterMockBuilder.create().withUrl('/collections/provider-1/moderation/all-items').build();

    TestBed.configureTestingModule({
      imports: [CollectionModerationComponent, ...MockComponents(SubHeaderComponent, SelectComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, of(true)),
      ],
    });

    fixture = TestBed.createComponent(CollectionModerationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should initialize selectedTab from route child data', () => {
    setup({ tab: CollectionModerationTab.Moderators });

    component.ngOnInit();

    expect(component.selectedTab).toBe(CollectionModerationTab.Moderators);
  });

  it('should navigate to not-found when providerId is missing', () => {
    setup({ providerId: '' });
    dispatchMock.mockClear();

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
    expect(dispatchMock).not.toHaveBeenCalledWith(expect.any(GetCollectionProvider));
  });

  it('should dispatch GetCollectionProvider on init when providerId exists', () => {
    setup({ providerId: 'provider-1' });
    dispatchMock.mockClear();

    component.ngOnInit();

    expect(dispatchMock).toHaveBeenCalledWith(new GetCollectionProvider('provider-1'));
  });

  it('should clear current provider on destroy', () => {
    setup();
    dispatchMock.mockClear();

    component.ngOnDestroy();

    const actionTypes = dispatchMock.mock.calls.map((call) => {
      const action = call[0] as { constructor: { name: string } };
      return action.constructor.name;
    });

    expect(actionTypes).toContain('ClearCurrentProvider');
  });

  it('should update selectedTab and navigate on tab change', () => {
    setup();

    component.onTabChange(CollectionModerationTab.Settings);

    expect(component.selectedTab).toBe(CollectionModerationTab.Settings);
    expect(mockRouter.navigate).toHaveBeenCalledWith([CollectionModerationTab.Settings], {
      relativeTo: component.route,
    });
  });
});
