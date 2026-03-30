import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { BookmarksSelectors } from '@osf/shared/stores/bookmarks';

import { RegistrationOverviewToolbarComponent } from './registration-overview-toolbar.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

const MOCK_RESOURCE_ID = 'registration-123';
const MOCK_BOOKMARKS_COLLECTION_ID = 'bookmarks-123';

interface SetupOverrides {
  bookmarks?: { id: string }[];
  bookmarksCollectionId?: string | null;
  isAuthenticated?: boolean;
  selectorOverrides?: SignalOverride[];
}

function setup(overrides: SetupOverrides = {}) {
  const mockToastService = ToastServiceMock.simple();

  const defaultSignals = [
    {
      selector: BookmarksSelectors.getBookmarksCollectionId,
      value: 'bookmarksCollectionId' in overrides ? overrides.bookmarksCollectionId : MOCK_BOOKMARKS_COLLECTION_ID,
    },
    { selector: BookmarksSelectors.getBookmarks, value: overrides.bookmarks ?? [] },
    { selector: BookmarksSelectors.areBookmarksLoading, value: false },
    { selector: BookmarksSelectors.getBookmarksCollectionIdSubmitting, value: false },
    { selector: UserSelectors.isAuthenticated, value: overrides.isAuthenticated ?? true },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [RegistrationOverviewToolbarComponent, MockComponent(SocialsShareButtonComponent)],
    providers: [provideOSFCore(), MockProvider(ToastService, mockToastService), provideMockStore({ signals })],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistrationOverviewToolbarComponent);
  fixture.componentRef.setInput('resourceId', MOCK_RESOURCE_ID);
  fixture.componentRef.setInput('resourceTitle', 'Test Registration');
  fixture.componentRef.setInput('isPublic', true);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, store, mockToastService };
}

describe('RegistrationOverviewToolbarComponent', () => {
  it('should dispatch GetResourceBookmark on init', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        bookmarkCollectionId: MOCK_BOOKMARKS_COLLECTION_ID,
        resourceId: MOCK_RESOURCE_ID,
        resourceType: ResourceType.Registration,
      })
    );
  });

  it('should not dispatch GetResourceBookmark when bookmarksCollectionId is null', () => {
    const { store } = setup({ bookmarksCollectionId: null });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should compute isBookmarked from bookmarks', () => {
    const { component } = setup({ bookmarks: [{ id: MOCK_RESOURCE_ID }] });

    expect(component.isBookmarked()).toBe(true);
  });

  it('should compute isBookmarked as false when not in bookmarks', () => {
    const { component } = setup({ bookmarks: [{ id: 'other-id' }] });

    expect(component.isBookmarked()).toBe(false);
  });

  it('should dispatch add bookmark when not bookmarked', () => {
    const { component, store, mockToastService } = setup();
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        bookmarkCollectionId: MOCK_BOOKMARKS_COLLECTION_ID,
        resourceId: MOCK_RESOURCE_ID,
        resourceType: ResourceType.Registration,
      })
    );
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.bookmark.add');
  });

  it('should dispatch remove bookmark when already bookmarked', () => {
    const { component, store, mockToastService } = setup({ bookmarks: [{ id: MOCK_RESOURCE_ID }] });
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        bookmarkCollectionId: MOCK_BOOKMARKS_COLLECTION_ID,
        resourceId: MOCK_RESOURCE_ID,
        resourceType: ResourceType.Registration,
      })
    );
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.bookmark.remove');
  });

  it('should not dispatch toggleBookmark when resourceId is empty', () => {
    const { fixture, store, mockToastService } = setup();
    fixture.componentRef.setInput('resourceId', '');
    fixture.detectChanges();
    jest.spyOn(store, 'dispatch').mockClear().mockReturnValue(of(undefined));

    fixture.componentInstance.toggleBookmark();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockToastService.showSuccess).not.toHaveBeenCalled();
  });
});
