import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { BookmarksSelectors } from '@osf/shared/stores/bookmarks';

import { RegistrationOverviewToolbarComponent } from './registration-overview-toolbar.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('RegistrationOverviewToolbarComponent', () => {
  let component: RegistrationOverviewToolbarComponent;
  let fixture: ComponentFixture<RegistrationOverviewToolbarComponent>;
  let store: jest.Mocked<Store>;
  let toastService: ReturnType<ToastServiceMockBuilder['build']>;

  const mockResourceId = 'registration-123';
  const mockResourceTitle = 'Test Registration';
  const mockBookmarksCollectionId = 'bookmarks-123';

  beforeEach(async () => {
    toastService = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [RegistrationOverviewToolbarComponent, OSFTestingModule, MockComponent(SocialsShareButtonComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: BookmarksSelectors.getBookmarksCollectionId, value: mockBookmarksCollectionId },
            { selector: BookmarksSelectors.getBookmarks, value: [] },
            { selector: BookmarksSelectors.areBookmarksLoading, value: false },
            { selector: BookmarksSelectors.getBookmarksCollectionIdSubmitting, value: false },
            { selector: UserSelectors.isAuthenticated, value: true },
          ],
        }),
        MockProvider(ToastService, toastService),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));

    fixture = TestBed.createComponent(RegistrationOverviewToolbarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceTitle', mockResourceTitle);
    fixture.componentRef.setInput('isPublic', true);
  });

  it('should set resourceId input correctly', () => {
    fixture.detectChanges();
    expect(component.resourceId()).toBe(mockResourceId);
  });

  it('should set resourceTitle input correctly', () => {
    fixture.detectChanges();
    expect(component.resourceTitle()).toBe(mockResourceTitle);
  });

  it('should set isPublic input correctly', () => {
    fixture.detectChanges();
    expect(component.isPublic()).toBe(true);
  });

  it('should dispatch GetResourceBookmark when bookmarksCollectionId and resourceId exist', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        bookmarkCollectionId: mockBookmarksCollectionId,
        resourceId: mockResourceId,
        resourceType: ResourceType.Registration,
      })
    );
  });

  it('should set isBookmarked to false when bookmarks array is empty', () => {
    fixture.detectChanges();
    expect(component.isBookmarked()).toBe(false);
  });

  it('should not do anything when resourceId is missing', () => {
    fixture.componentRef.setInput('resourceId', '');
    fixture.detectChanges();

    component.toggleBookmark();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should add bookmark when isBookmarked is false', () => {
    fixture.detectChanges();
    component.isBookmarked.set(false);
    jest.clearAllMocks();

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        bookmarkCollectionId: mockBookmarksCollectionId,
        resourceId: mockResourceId,
        resourceType: ResourceType.Registration,
      })
    );
  });

  it('should remove bookmark when isBookmarked is true', () => {
    fixture.detectChanges();
    component.isBookmarked.set(true);
    jest.clearAllMocks();

    component.toggleBookmark();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        bookmarkCollectionId: mockBookmarksCollectionId,
        resourceId: mockResourceId,
        resourceType: ResourceType.Registration,
      })
    );
  });
});
