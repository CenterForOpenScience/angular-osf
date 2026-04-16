import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { UpdateIndexing } from '../../store';

import { ShareIndexingComponent } from './share-indexing.component';

describe('ShareIndexingComponent', () => {
  let component: ShareIndexingComponent;
  let fixture: ComponentFixture<ShareIndexingComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ShareIndexingComponent],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getShareIndexing, value: true },
            { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ShareIndexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selected option from user share indexing selector', () => {
    expect(component.selectedOption).toBe(true);
  });

  it('should return true for noChanges when selected option equals current indexing value', () => {
    component.selectedOption = true;

    expect(component.noChanges).toBe(true);
  });

  it('should return false for noChanges when selected option differs from current indexing value', () => {
    component.selectedOption = false;

    expect(component.noChanges).toBe(false);
  });

  it('should not update indexing when selected option has no changes', () => {
    (store.dispatch as Mock).mockClear();
    component.selectedOption = true;

    component.updateIndexing();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateIndexing));
  });

  it('should not update indexing when selected option is undefined', () => {
    (store.dispatch as Mock).mockClear();
    component.selectedOption = undefined;

    component.updateIndexing();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateIndexing));
  });

  it('should update indexing and show success toast when option changes', () => {
    (store.dispatch as Mock).mockClear();
    component.selectedOption = false;

    component.updateIndexing();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateIndexing(false));
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.shareIndexing.successUpdate');
  });
});
