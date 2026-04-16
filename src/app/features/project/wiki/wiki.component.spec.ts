import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { BehaviorSubject, Subject } from 'rxjs';

import { Mock } from 'vitest';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { EditSectionComponent } from '@osf/shared/components/wiki/edit-section/edit-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { WikiModel, WikiModes } from '@osf/shared/models/wiki/wiki.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import {
  ClearWiki,
  CreateWiki,
  CreateWikiVersion,
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

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { WikiComponent } from './wiki.component';

describe('WikiComponent', () => {
  let component: WikiComponent;
  let fixture: ComponentFixture<WikiComponent>;
  let store: Store;
  let router: RouterMockType;
  let toastService: ToastServiceMockType;
  let queryParams$: Subject<Record<string, string>>;
  let viewOnlyService: ViewOnlyLinkHelperMockType;

  const projectId$ = new BehaviorSubject<Record<string, string>>({ id: 'p1' });

  const mockWikiList: WikiModel[] = [{ id: 'w1', name: 'Home', kind: 'wiki' }];

  const defaultSignals: SignalOverride[] = [
    { selector: WikiSelectors.getWikiList, value: mockWikiList },
    { selector: WikiSelectors.getComponentsWikiList, value: [] },
    { selector: WikiSelectors.getWikiModes, value: { view: true, edit: false, compare: false } },
    { selector: WikiSelectors.getPreviewContent, value: '' },
    { selector: WikiSelectors.getWikiVersionContent, value: '' },
    { selector: WikiSelectors.getCompareVersionContent, value: '' },
    { selector: WikiSelectors.getWikiListLoading, value: false },
    { selector: WikiSelectors.getComponentsWikiListLoading, value: false },
    { selector: WikiSelectors.getCurrentWikiId, value: 'w1' },
    { selector: WikiSelectors.getWikiVersions, value: [] },
    { selector: WikiSelectors.getWikiVersionSubmitting, value: false },
    { selector: WikiSelectors.getWikiVersionsLoading, value: false },
    { selector: WikiSelectors.getCompareVersionsLoading, value: false },
    { selector: WikiSelectors.isWikiAnonymous, value: false },
    { selector: CurrentResourceSelectors.hasWriteAccess, value: true },
  ];

  function setup({
    snapshotWikiId,
    wikiList,
    hasWriteAccess,
    currentWikiId,
    hasViewOnly = false,
    selectorOverrides,
  }: {
    snapshotWikiId?: string;
    wikiList?: WikiModel[];
    hasWriteAccess?: boolean;
    currentWikiId?: string;
    hasViewOnly?: boolean;
    selectorOverrides?: SignalOverride[];
  } = {}) {
    queryParams$ = new Subject<Record<string, string>>();
    router = RouterMockBuilder.create().withUrl('/project/p1/wiki').build();
    toastService = ToastServiceMock.simple();
    viewOnlyService = ViewOnlyLinkHelperMock.simple(hasViewOnly);

    const route = ActivatedRouteMockBuilder.create()
      .withQueryParams(snapshotWikiId ? { wiki: snapshotWikiId } : {})
      .withParentRoute({
        params: projectId$.asObservable(),
        snapshot: { params: projectId$.value } as Partial<ActivatedRoute['snapshot']>,
      } as Partial<ActivatedRoute>)
      .build();
    (route as Partial<ActivatedRoute>).queryParams = queryParams$.asObservable();
    (route.snapshot as { queryParams: Record<string, unknown> }).queryParams = snapshotWikiId
      ? { wiki: snapshotWikiId }
      : {};

    const signals = mergeSignalOverrides(defaultSignals, [
      ...(wikiList !== undefined ? [{ selector: WikiSelectors.getWikiList, value: wikiList }] : []),
      ...(hasWriteAccess !== undefined
        ? [{ selector: CurrentResourceSelectors.hasWriteAccess, value: hasWriteAccess }]
        : []),
      ...(currentWikiId !== undefined ? [{ selector: WikiSelectors.getCurrentWikiId, value: currentWikiId }] : []),
      ...(selectorOverrides ?? []),
    ]);

    TestBed.configureTestingModule({
      imports: [
        WikiComponent,
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
        provideOSFCore(),
        MockProvider(PLATFORM_ID, 'browser'),
        MockProvider(ActivatedRoute, route),
        MockProvider(ToastService, toastService),
        MockProvider(Router, router),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(WikiComponent);
    component = fixture.componentInstance;
  }

  it('should create', async () => {
    setup();
    await fixture.whenStable();

    expect(component).toBeTruthy();
  });

  it('should dispatch initial wiki list actions and navigate when no wiki query param', async () => {
    setup({ snapshotWikiId: undefined, wikiList: mockWikiList });
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(new GetWikiList(ResourceType.Project, 'p1'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetComponentsWikiList(ResourceType.Project, 'p1'));
    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { wiki: 'w1' },
      queryParamsHandling: 'merge',
    });
  });

  it('should set current wiki and fetch versions when queryParams emit wiki id', async () => {
    setup({ snapshotWikiId: undefined });
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    queryParams$.next({ wiki: 'w2' });
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(new SetCurrentWiki('w2'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetWikiVersions('w2'));
  });

  it('should create home wiki when list is empty and user has write access', async () => {
    setup({ wikiList: [], hasWriteAccess: true, snapshotWikiId: undefined });
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(new CreateWiki(ResourceType.Project, 'p1', 'Home'));
  });

  it('should expose hasViewOnly from view-only service', async () => {
    setup({ hasViewOnly: true });
    await fixture.whenStable();

    expect(component.hasViewOnly()).toBe(true);
  });

  it('toggleMode should dispatch toggle action', async () => {
    setup();
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    component.toggleMode(WikiModes.Edit);

    expect(store.dispatch).toHaveBeenCalledWith(new ToggleMode(WikiModes.Edit));
  });

  it('updateWikiPreviewContent should dispatch update action', async () => {
    setup();
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    component.updateWikiPreviewContent('abc');

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateWikiPreviewContent('abc'));
  });

  it('onSaveContent should dispatch create version, show toast, and refresh versions', async () => {
    setup({ currentWikiId: 'w1' });
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    component.onSaveContent('content');

    expect(store.dispatch).toHaveBeenCalledWith(new CreateWikiVersion('w1', 'content'));
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.wiki.version.successSaved');
    expect(store.dispatch).toHaveBeenCalledWith(new GetWikiVersions('w1'));
  });

  it('onSelectVersion should dispatch get version content', async () => {
    setup({ currentWikiId: 'w1' });
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    component.onSelectVersion('v1');

    expect(store.dispatch).toHaveBeenCalledWith(new GetWikiVersionContent('w1', 'v1'));
  });

  it('onSelectCompareVersion should dispatch get compare content', async () => {
    setup({ currentWikiId: 'w1' });
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    component.onSelectCompareVersion('v2');

    expect(store.dispatch).toHaveBeenCalledWith(new GetCompareVersionContent('w1', 'v2'));
  });

  it('should clear wiki on destroy in browser', async () => {
    setup();
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearWiki());
  });
});
