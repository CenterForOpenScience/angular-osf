import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModes } from '@osf/shared/models/wiki/wiki.model';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import {
  ClearWiki,
  GetCompareVersionContent,
  GetComponentsWikiList,
  GetWikiList,
  GetWikiVersionContent,
  GetWikiVersions,
  SetCurrentWiki,
  ToggleMode,
  WikiSelectors,
} from '@osf/shared/stores/wiki';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { RegistryWikiComponent } from './registry-wiki.component';

describe('RegistryWikiComponent', () => {
  let component: RegistryWikiComponent;
  let fixture: ComponentFixture<RegistryWikiComponent>;
  let store: Store;
  let dispatchMock: Mock;
  let routerMock: RouterMockType;
  let viewOnlyMock: ViewOnlyLinkHelperMockType;

  interface SetupOverrides {
    queryParams?: Record<string, unknown>;
    routeParams?: Record<string, string>;
    selectorOverrides?: SignalOverride[];
    hasViewOnly?: boolean;
  }

  const defaultSignals: SignalOverride[] = [
    { selector: WikiSelectors.getWikiModes, value: { currentMode: WikiModes.View } },
    { selector: WikiSelectors.getPreviewContent, value: '' },
    { selector: WikiSelectors.getWikiVersionContent, value: '' },
    { selector: WikiSelectors.getCompareVersionContent, value: '' },
    { selector: WikiSelectors.getWikiListLoading, value: false },
    { selector: WikiSelectors.getComponentsWikiListLoading, value: false },
    { selector: WikiSelectors.getWikiList, value: [{ id: 'wiki-1', name: 'Wiki 1', kind: 'page' }] },
    { selector: WikiSelectors.getCurrentWikiId, value: 'wiki-1' },
    { selector: WikiSelectors.getWikiVersions, value: [] },
    { selector: WikiSelectors.getWikiVersionsLoading, value: false },
    { selector: WikiSelectors.getComponentsWikiList, value: [] },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const routeParams = overrides.routeParams ?? { id: 'registry-1' };
    const queryParams = overrides.queryParams ?? { wiki: 'wiki-1' };
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    routerMock = RouterMockBuilder.create().withUrl('/registries/registry-1/wiki?wiki=wiki-1').build();
    viewOnlyMock = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnly ?? false);

    const route = ActivatedRouteMockBuilder.create().withParams(routeParams).withQueryParams(queryParams).build();

    TestBed.configureTestingModule({
      imports: [
        RegistryWikiComponent,
        ...MockComponents(
          SubHeaderComponent,
          WikiListComponent,
          ViewSectionComponent,
          CompareSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, routerMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyMock),
        provideMockStore({ signals }),
      ],
    });

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should fetch wiki list and component wiki list on initialization', () => {
    setup();

    expect(dispatchMock).toHaveBeenCalledWith(new GetWikiList(ResourceType.Registration, 'registry-1'));
    expect(dispatchMock).toHaveBeenCalledWith(new GetComponentsWikiList(ResourceType.Registration, 'registry-1'));
  });

  it('should set current wiki and fetch versions from wiki query param', () => {
    setup({ queryParams: { wiki: 'wiki-1' } });

    expect(dispatchMock).toHaveBeenCalledWith(new SetCurrentWiki('wiki-1'));
    expect(dispatchMock).toHaveBeenCalledWith(new GetWikiVersions('wiki-1'));
  });

  it('should navigate to first wiki when wiki query param is missing', () => {
    setup({ queryParams: {} });

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { wiki: 'wiki-1' },
      queryParamsHandling: 'merge',
    });
  });

  it('should dispatch toggle mode action', () => {
    setup();
    dispatchMock.mockClear();

    component.toggleMode(WikiModes.Edit);

    expect(dispatchMock).toHaveBeenCalledWith(new ToggleMode(WikiModes.Edit));
  });

  it('should dispatch version content action on version select', () => {
    setup();
    dispatchMock.mockClear();

    component.onSelectVersion('v-2');

    expect(dispatchMock).toHaveBeenCalledWith(new GetWikiVersionContent('wiki-1', 'v-2'));
  });

  it('should dispatch compare version content action on compare version select', () => {
    setup();
    dispatchMock.mockClear();

    component.onSelectCompareVersion('v-3');

    expect(dispatchMock).toHaveBeenCalledWith(new GetCompareVersionContent('wiki-1', 'v-3'));
  });

  it('should compute wiki list loading from both loading selectors', () => {
    setup({
      selectorOverrides: [{ selector: WikiSelectors.getComponentsWikiListLoading, value: true }],
    });

    expect(component.isWikiListLoading()).toBe(true);
  });

  it('should expose view-only state from helper service', () => {
    setup({ hasViewOnly: true });

    expect(component.hasViewOnly()).toBe(true);
  });

  it('should clear wiki on destroy in browser', () => {
    setup();
    dispatchMock.mockClear();

    fixture.destroy();

    expect(dispatchMock).toHaveBeenCalledWith(new ClearWiki());
  });
});
