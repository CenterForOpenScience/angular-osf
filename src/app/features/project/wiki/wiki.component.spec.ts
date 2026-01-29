import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { EditSectionComponent } from '@osf/shared/components/wiki/edit-section/edit-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModes } from '@osf/shared/models/wiki/wiki.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import {
  ClearWiki,
  CreateWikiVersion,
  DeleteWiki,
  GetCompareVersionContent,
  GetComponentsWikiList,
  GetWikiList,
  GetWikiVersionContent,
  GetWikiVersions,
  SetCurrentWiki,
  ToggleMode,
  UpdateWikiPreviewContent,
  WikiSelectors,
} from '@osf/shared/stores/wiki';
import { ViewOnlyLinkMessageComponent } from '@shared/components/view-only-link-message/view-only-link-message.component';

import { WikiComponent } from './wiki.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('WikiComponent', () => {
  let component: WikiComponent;
  let fixture: ComponentFixture<WikiComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let storeDispatchSpy: jest.SpyInstance;
  let queryParamsSubject: Subject<any>;

  const mockProjectId = 'project-123';
  const mockWikiId = 'wiki-123';
  const mockWikiList = [{ id: 'wiki-1', name: 'Wiki 1' }] as any;

  beforeEach(async () => {
    queryParamsSubject = new Subject();
    routerMock = RouterMockBuilder.create().build();
    toastServiceMock = ToastServiceMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ id: mockProjectId })
      .withQueryParams({ wiki: mockWikiId })
      .build();

    Object.defineProperty(activatedRouteMock, 'queryParams', {
      value: queryParamsSubject.asObservable(),
      writable: true,
    });

    const mockStore = provideMockStore({
      signals: [
        { selector: CurrentResourceSelectors.hasWriteAccess, value: signal(true) },
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
        { selector: WikiSelectors.getCompareVersionsLoading, value: signal(false) },
        { selector: WikiSelectors.getWikiVersionSubmitting, value: signal(false) },
      ],
    });

    storeDispatchSpy = jest.spyOn(mockStore.useValue, 'dispatch');

    await TestBed.configureTestingModule({
      imports: [
        WikiComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          WikiListComponent,
          ViewSectionComponent,
          EditSectionComponent,
          CompareSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers: [
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(ToastService, toastServiceMock),
        mockStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch getWikiList and getComponentsWikiList on construction', () => {
    expect(storeDispatchSpy).toHaveBeenCalledTimes(2);

    const getWikiListCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof GetWikiList);
    const getComponentsWikiListCall = storeDispatchSpy.mock.calls.find(
      (call) => call[0] instanceof GetComponentsWikiList
    );

    expect(getWikiListCall).toBeDefined();
    expect(getWikiListCall[0].resourceType).toBe(ResourceType.Project);
    expect(getWikiListCall[0].resourceId).toBe(mockProjectId);

    expect(getComponentsWikiListCall).toBeDefined();
    expect(getComponentsWikiListCall[0].resourceType).toBe(ResourceType.Project);
    expect(getComponentsWikiListCall[0].resourceId).toBe(mockProjectId);
  });

  it('should call toggleMode action when toggleMode is called', () => {
    storeDispatchSpy.mockClear();

    component.toggleMode(WikiModes.Edit);

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(ToggleMode));
    const action = storeDispatchSpy.mock.calls[0][0] as ToggleMode;
    expect(action.mode).toBe(WikiModes.Edit);
  });

  it('should call updateWikiPreviewContent action when updateWikiPreviewContent is called', () => {
    storeDispatchSpy.mockClear();
    const content = 'New preview content';

    component.updateWikiPreviewContent(content);

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(UpdateWikiPreviewContent));
    const action = storeDispatchSpy.mock.calls[0][0] as UpdateWikiPreviewContent;
    expect(action.content).toBe(content);
  });

  it('should dispatch deleteWiki when onDeleteWiki is called', () => {
    storeDispatchSpy.mockClear();

    component.onDeleteWiki();

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(DeleteWiki));
    const action = storeDispatchSpy.mock.calls[0][0] as DeleteWiki;
    expect(action.wikiId).toBe(mockWikiId);
  });

  it('should dispatch createWikiVersion, show toast, and get versions when onSaveContent is called', () => {
    storeDispatchSpy.mockClear();
    const content = 'New wiki content';

    component.onSaveContent(content);

    const createVersionCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof CreateWikiVersion);
    expect(createVersionCall).toBeDefined();
    expect((createVersionCall[0] as CreateWikiVersion).wikiId).toBe(mockWikiId);
    expect((createVersionCall[0] as CreateWikiVersion).content).toBe(content);

    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('project.wiki.version.successSaved');

    const getVersionsCall = storeDispatchSpy.mock.calls.find((call) => call[0] instanceof GetWikiVersions);
    expect(getVersionsCall).toBeDefined();
    expect((getVersionsCall[0] as GetWikiVersions).wikiId).toBe(mockWikiId);
  });

  it('should dispatch getWikiVersionContent when onSelectVersion is called', () => {
    storeDispatchSpy.mockClear();
    const versionId = 'version-123';

    component.onSelectVersion(versionId);

    expect(storeDispatchSpy).toHaveBeenCalledWith(expect.any(GetWikiVersionContent));
    const action = storeDispatchSpy.mock.calls[0][0] as GetWikiVersionContent;
    expect(action.wikiId).toBe(mockWikiId);
    expect(action.versionId).toBe(versionId);
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
