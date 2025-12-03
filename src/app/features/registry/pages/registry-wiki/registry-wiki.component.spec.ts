import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModes } from '@osf/shared/models/wiki/wiki.model';
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
import { ViewOnlyLinkMessageComponent } from '@shared/components/view-only-link-message/view-only-link-message.component';

import { RegistryWikiComponent } from './registry-wiki.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryWikiComponent', () => {
  let component: RegistryWikiComponent;
  let fixture: ComponentFixture<RegistryWikiComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let storeDispatchSpy: jest.SpyInstance;
  let queryParamsSubject: Subject<any>;

  const mockResourceId = 'resource-123';
  const mockWikiId = 'wiki-123';
  const mockWikiList = [{ id: 'wiki-1', name: 'Wiki 1' }] as any;

  beforeEach(async () => {
    queryParamsSubject = new Subject();
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ id: mockResourceId })
      .withQueryParams({ wiki: mockWikiId })
      .build();

    Object.defineProperty(activatedRouteMock, 'queryParams', {
      value: queryParamsSubject.asObservable(),
      writable: true,
    });

    const mockStore = provideMockStore({
      signals: [
        { selector: WikiSelectors.getWikiModes, value: signal({ view: true, edit: false, compare: false }) },
        { selector: WikiSelectors.getPreviewContent, value: signal('Preview content') },
        { selector: WikiSelectors.getWikiVersionContent, value: signal('Version content') },
        { selector: WikiSelectors.getCompareVersionContent, value: signal('Compare content') },
        { selector: WikiSelectors.getWikiList, value: signal(mockWikiList) },
        { selector: WikiSelectors.getComponentsWikiList, value: signal([]) },
        { selector: WikiSelectors.getCurrentWikiId, value: signal(mockWikiId) },
        { selector: WikiSelectors.getWikiVersions, value: signal([]) },
        { selector: WikiSelectors.getWikiListLoading, value: signal(false) },
        { selector: WikiSelectors.getComponentsWikiListLoading, value: signal(false) },
        { selector: WikiSelectors.getWikiVersionsLoading, value: signal(false) },
      ],
    });

    storeDispatchSpy = jest.spyOn(mockStore.useValue, 'dispatch');

    await TestBed.configureTestingModule({
      imports: [
        RegistryWikiComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          WikiListComponent,
          ViewSectionComponent,
          CompareSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers: [MockProvider(Router, routerMock), MockProvider(ActivatedRoute, activatedRouteMock), mockStore],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch getWikiList and getComponentsWikiList on construction', () => {
    expect(storeDispatchSpy).toHaveBeenCalledTimes(2);

    const getWikiListCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof GetWikiList);
    const getComponentsWikiListCall = storeDispatchSpy.mock.calls.find(
      (call) => call[0] instanceof GetComponentsWikiList
    );

    expect(getWikiListCall).toBeDefined();
    expect(getWikiListCall[0].resourceType).toBe(ResourceType.Registration);
    expect(getWikiListCall[0].resourceId).toBe(mockResourceId);

    expect(getComponentsWikiListCall).toBeDefined();
    expect(getComponentsWikiListCall[0].resourceType).toBe(ResourceType.Registration);
    expect(getComponentsWikiListCall[0].resourceId).toBe(mockResourceId);
  });

  it('should call toggleMode action when toggleMode is called', () => {
    storeDispatchSpy.mockClear();

    component.toggleMode(WikiModes.Edit);

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(ToggleMode));
    const action = storeDispatchSpy.mock.calls[0][0] as ToggleMode;
    expect(action.mode).toBe(WikiModes.Edit);
  });

  it('should dispatch getWikiVersionContent when onSelectVersion is called with versionId', () => {
    storeDispatchSpy.mockClear();
    const versionId = 'version-123';

    component.onSelectVersion(versionId);

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(GetWikiVersionContent));
    const action = storeDispatchSpy.mock.calls[0][0] as GetWikiVersionContent;
    expect(action.wikiId).toBe(mockWikiId);
    expect(action.versionId).toBe(versionId);
  });

  it('should not dispatch getWikiVersionContent when onSelectVersion is called with empty versionId', () => {
    storeDispatchSpy.mockClear();

    component.onSelectVersion('');

    const getVersionContentCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof GetWikiVersionContent);
    expect(getVersionContentCall).toBeUndefined();
  });

  it('should dispatch getCompareVersionContent when onSelectCompareVersion is called', () => {
    storeDispatchSpy.mockClear();
    const versionId = 'version-123';

    component.onSelectCompareVersion(versionId);

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(GetCompareVersionContent));
    const action = storeDispatchSpy.mock.calls[0][0] as GetCompareVersionContent;
    expect(action.wikiId).toBe(mockWikiId);
    expect(action.versionId).toBe(versionId);
  });

  it('should handle query params changes and dispatch setCurrentWiki and getWikiVersions', () => {
    storeDispatchSpy.mockClear();
    const newWikiId = 'new-wiki-123';

    queryParamsSubject.next({ wiki: newWikiId });

    const setCurrentWikiCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof SetCurrentWiki);
    expect(setCurrentWikiCall).toBeDefined();
    expect((setCurrentWikiCall[0] as SetCurrentWiki).wikiId).toBe(newWikiId);

    const getVersionsCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof GetWikiVersions);
    expect(getVersionsCall).toBeDefined();
    expect((getVersionsCall[0] as GetWikiVersions).wikiId).toBe(newWikiId);
  });

  it('should not process query params when wiki is empty', () => {
    storeDispatchSpy.mockClear();

    queryParamsSubject.next({ wiki: '' });

    const setCurrentWikiCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof SetCurrentWiki);
    expect(setCurrentWikiCall).toBeUndefined();
  });

  it('should dispatch clearWiki on destroy', () => {
    storeDispatchSpy.mockClear();

    fixture.destroy();

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(ClearWiki));
  });
});
