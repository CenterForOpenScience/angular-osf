import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ForkRegistry } from '@osf/features/registry/store/registry';
import { ForkMenuButtonComponent } from '@osf/shared/components/fork-menu-button/fork-menu-button.component';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources-item.model';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores/bookmarks';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ForkDialogServiceMock, ForkDialogServiceMockType } from '@testing/providers/fork-dialog.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { RegistrationOverviewToolbarComponent } from './registration-overview-toolbar.component';

interface SetupOverrides extends BaseSetupOverrides {
  resourceId?: string;
  isPublic?: boolean;
  viewOnly?: boolean;
}

describe('RegistrationOverviewToolbarComponent', () => {
  let component: RegistrationOverviewToolbarComponent;
  let fixture: ComponentFixture<RegistrationOverviewToolbarComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let toastService: ToastServiceMockType;
  let forkDialogService: ForkDialogServiceMockType;

  const bookmarkedItem = { id: 'reg-1' } as MyResourcesItem;

  function setup(overrides: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create().build();
    toastService = ToastServiceMock.simple();
    forkDialogService = ForkDialogServiceMock.simple();

    const defaultSignals = [
      { selector: BookmarksSelectors.getBookmarksCollectionId, value: 'bookmarks-1' },
      { selector: BookmarksSelectors.getBookmarks, value: [] },
      { selector: BookmarksSelectors.areBookmarksLoading, value: false },
      { selector: BookmarksSelectors.getBookmarksCollectionIdSubmitting, value: false },
      { selector: UserSelectors.isAuthenticated, value: true },
      { selector: UserSelectors.isProjectCreationDisabled, value: false },
    ];
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [
        RegistrationOverviewToolbarComponent,
        ...MockComponents(ForkMenuButtonComponent, SocialsShareButtonComponent),
      ],
      providers: [
        provideOSFCore(),
        provideMockStore({ signals }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
        MockProvider(ToastService, toastService),
        MockProvider(ForkDialogService, forkDialogService),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistrationOverviewToolbarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('resourceId', overrides.resourceId ?? 'reg-1');
    fixture.componentRef.setInput('resourceTitle', 'Test Registration');
    fixture.componentRef.setInput('isPublic', overrides.isPublic ?? true);
    fixture.componentRef.setInput('viewOnly', overrides.viewOnly ?? false);
    fixture.detectChanges();
  }

  function query(selector: string): HTMLElement | null {
    return fixture.nativeElement.querySelector(selector);
  }

  it('should dispatch GetResourceBookmark on init', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetResourceBookmark('bookmarks-1', 'reg-1', ResourceType.Registration)
    );
  });

  it('should not dispatch GetResourceBookmark without bookmarks collection id', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarksCollectionId, value: null }] });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetResourceBookmark));
  });

  it('should render fork menu, bookmark and share buttons for authenticated user', () => {
    setup();

    expect(query('osf-fork-menu-button')).toBeTruthy();
    expect(query('p-button')).toBeTruthy();
    expect(query('osf-socials-share-button')).toBeTruthy();
  });

  it('should render nothing when resourceId is empty', () => {
    setup({ resourceId: '' });

    expect(query('div')).toBeNull();
  });

  it('should hide fork menu in view only mode', () => {
    setup({ viewOnly: true });

    expect(query('osf-fork-menu-button')).toBeNull();
    expect(query('p-button')).toBeTruthy();
  });

  it('should hide fork menu and bookmark button for unauthenticated user', () => {
    setup({ selectorOverrides: [{ selector: UserSelectors.isAuthenticated, value: false }] });

    expect(query('osf-fork-menu-button')).toBeNull();
    expect(query('p-button')).toBeNull();
  });

  it('should hide share button for private registration', () => {
    setup({ isPublic: false });

    expect(query('osf-socials-share-button')).toBeNull();
  });

  it('should compute isBookmarked from bookmarks', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarks, value: [bookmarkedItem] }] });

    expect(component.isBookmarked()).toBe(true);
  });

  it('should add bookmark and show toast when not bookmarked', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      new AddResourceToBookmarks('bookmarks-1', 'reg-1', ResourceType.Registration)
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.bookmark.add');
  });

  it('should remove bookmark and show toast when bookmarked', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarks, value: [bookmarkedItem] }] });
    (store.dispatch as Mock).mockClear();

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      new RemoveResourceFromBookmarks('bookmarks-1', 'reg-1', ResourceType.Registration)
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.bookmark.remove');
  });

  it('should not toggle bookmark without bookmarks collection id', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarksCollectionId, value: null }] });
    (store.dispatch as Mock).mockClear();

    component.toggleBookmark();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should navigate to duplicates view', () => {
    setup();

    component.forkActionItems[1].command?.({});

    expect(routerMock.navigate).toHaveBeenCalledWith(['../analytics/duplicates'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });

  it('should open fork confirmation for registration', () => {
    setup();

    component.forkActionItems[0].command?.({});

    expect(forkDialogService.confirmFork).toHaveBeenCalledWith(
      expect.objectContaining({ resourceType: CurrentResourceType.Registrations })
    );
  });

  it('should dispatch ForkRegistry when fork is confirmed', () => {
    setup();
    component.forkActionItems[0].command?.({});
    const [options] = forkDialogService.confirmFork.mock.calls[0];
    (store.dispatch as Mock).mockClear();

    options.fork();

    expect(store.dispatch).toHaveBeenCalledWith(new ForkRegistry('reg-1'));
  });
});
