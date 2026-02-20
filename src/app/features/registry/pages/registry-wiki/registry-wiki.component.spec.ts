import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

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

import { RegistryWikiComponent } from './registry-wiki.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

const MOCK_WIKI_LIST = [{ id: 'wiki-1', name: 'Wiki 1' }];

interface SetupOverrides extends BaseSetupOverrides {
  queryParams?: Record<string, string>;
}

function setup(overrides: SetupOverrides = {}) {
  const queryParams = overrides.queryParams ?? { wiki: 'wiki-123' };

  const routeBuilder = ActivatedRouteMockBuilder.create()
    .withParams(overrides.routeParams ?? { id: 'resource-123' })
    .withQueryParams(queryParams);

  const mockRoute = routeBuilder.build();
  const mockRouter = RouterMockBuilder.create().build();
  const mockViewOnlyHelper = ViewOnlyLinkHelperMock.simple();

  const defaultSignals = [
    { selector: WikiSelectors.getWikiModes, value: { view: true, edit: false, compare: false } },
    { selector: WikiSelectors.getPreviewContent, value: 'Preview content' },
    { selector: WikiSelectors.getWikiVersionContent, value: 'Version content' },
    { selector: WikiSelectors.getCompareVersionContent, value: 'Compare content' },
    { selector: WikiSelectors.getWikiList, value: MOCK_WIKI_LIST },
    { selector: WikiSelectors.getComponentsWikiList, value: [] },
    { selector: WikiSelectors.getCurrentWikiId, value: 'wiki-123' },
    { selector: WikiSelectors.getWikiVersions, value: [] },
    { selector: WikiSelectors.getWikiListLoading, value: false },
    { selector: WikiSelectors.getComponentsWikiListLoading, value: false },
    { selector: WikiSelectors.getWikiVersionsLoading, value: false },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [
      RegistryWikiComponent,
      ...MockComponents(WikiListComponent, ViewSectionComponent, CompareSectionComponent, ViewOnlyLinkMessageComponent),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockRoute),
      MockProvider(Router, mockRouter),
      MockProvider(ViewOnlyLinkHelperService, mockViewOnlyHelper),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryWikiComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, store, mockRouter, routeBuilder };
}

describe('RegistryWikiComponent', () => {
  it('should dispatch getWikiList and getComponentsWikiList on construction', () => {
    const { store } = setup();

    const calls = (store.dispatch as jest.Mock).mock.calls;
    const getWikiListCall = calls.find(([a]: [unknown]) => a instanceof GetWikiList);
    const getComponentsCall = calls.find(([a]: [unknown]) => a instanceof GetComponentsWikiList);

    expect(getWikiListCall).toBeDefined();
    expect(getWikiListCall[0].resourceType).toBe(ResourceType.Registration);
    expect(getWikiListCall[0].resourceId).toBe('resource-123');

    expect(getComponentsCall).toBeDefined();
    expect(getComponentsCall[0].resourceType).toBe(ResourceType.Registration);
    expect(getComponentsCall[0].resourceId).toBe('resource-123');
  });

  it('should dispatch setCurrentWiki and getWikiVersions from initial query params', () => {
    const { store } = setup();

    const calls = (store.dispatch as jest.Mock).mock.calls;
    const setCurrentWikiCall = calls.find(([a]: [unknown]) => a instanceof SetCurrentWiki);
    const getVersionsCall = calls.find(([a]: [unknown]) => a instanceof GetWikiVersions);

    expect(setCurrentWikiCall).toBeDefined();
    expect(setCurrentWikiCall[0].wikiId).toBe('wiki-123');

    expect(getVersionsCall).toBeDefined();
    expect(getVersionsCall[0].wikiId).toBe('wiki-123');
  });

  it('should navigate to first wiki when no wiki query param', () => {
    const { mockRouter } = setup({ queryParams: {} });

    expect(mockRouter.navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { wiki: 'wiki-1' } }));
  });

  it('should not navigate to first wiki when wiki query param exists', () => {
    const { mockRouter } = setup();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle query params changes and dispatch setCurrentWiki and getWikiVersions', () => {
    const { store, routeBuilder } = setup();

    (store.dispatch as jest.Mock).mockClear();

    routeBuilder.withQueryParams({ wiki: 'new-wiki-456' });

    const calls = (store.dispatch as jest.Mock).mock.calls;
    const setCurrentWikiCall = calls.find(([a]: [unknown]) => a instanceof SetCurrentWiki);
    const getVersionsCall = calls.find(([a]: [unknown]) => a instanceof GetWikiVersions);

    expect(setCurrentWikiCall[0].wikiId).toBe('new-wiki-456');
    expect(getVersionsCall[0].wikiId).toBe('new-wiki-456');
  });

  it('should not process query params when wiki is empty', () => {
    const { store } = setup({ queryParams: {} });

    const calls = (store.dispatch as jest.Mock).mock.calls;
    const setCurrentWikiCall = calls.find(([a]: [unknown]) => a instanceof SetCurrentWiki);

    expect(setCurrentWikiCall).toBeUndefined();
  });

  it('should call toggleMode action', () => {
    const { component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.toggleMode(WikiModes.Compare);

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ToggleMode));
    expect((store.dispatch as jest.Mock).mock.calls[0][0].mode).toBe(WikiModes.Compare);
  });

  it('should dispatch getWikiVersionContent on onSelectVersion', () => {
    const { component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.onSelectVersion('version-1');

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetWikiVersionContent));
    const action = (store.dispatch as jest.Mock).mock.calls[0][0] as GetWikiVersionContent;
    expect(action.wikiId).toBe('wiki-123');
    expect(action.versionId).toBe('version-1');
  });

  it('should not dispatch getWikiVersionContent with empty versionId', () => {
    const { component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.onSelectVersion('');

    const calls = (store.dispatch as jest.Mock).mock.calls;
    expect(calls.find(([a]: [unknown]) => a instanceof GetWikiVersionContent)).toBeUndefined();
  });

  it('should dispatch getCompareVersionContent on onSelectCompareVersion', () => {
    const { component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.onSelectCompareVersion('version-2');

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetCompareVersionContent));
    const action = (store.dispatch as jest.Mock).mock.calls[0][0] as GetCompareVersionContent;
    expect(action.wikiId).toBe('wiki-123');
    expect(action.versionId).toBe('version-2');
  });

  it('should not dispatch getCompareVersionContent with empty versionId', () => {
    const { component, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    component.onSelectCompareVersion('');

    const calls = (store.dispatch as jest.Mock).mock.calls;
    expect(calls.find(([a]: [unknown]) => a instanceof GetCompareVersionContent)).toBeUndefined();
  });

  it('should dispatch clearWiki on destroy', () => {
    const { fixture, store } = setup();

    (store.dispatch as jest.Mock).mockClear();
    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearWiki));
  });

  it('should compute isWikiListLoading from both loading selectors', () => {
    const wikiListLoadingSignal: WritableSignal<boolean> = signal(false);
    const componentsLoadingSignal: WritableSignal<boolean> = signal(false);

    const { component } = setup({
      selectorOverrides: [
        { selector: WikiSelectors.getWikiListLoading, value: wikiListLoadingSignal },
        { selector: WikiSelectors.getComponentsWikiListLoading, value: componentsLoadingSignal },
      ],
    });

    expect(component.isWikiListLoading()).toBe(false);

    wikiListLoadingSignal.set(true);
    expect(component.isWikiListLoading()).toBe(true);

    wikiListLoadingSignal.set(false);
    componentsLoadingSignal.set(true);
    expect(component.isWikiListLoading()).toBe(true);
  });
});
