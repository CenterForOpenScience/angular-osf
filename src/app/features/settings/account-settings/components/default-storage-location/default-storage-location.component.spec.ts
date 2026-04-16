import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { IdNameModel } from '@osf/shared/models/common/id-name.model';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { RegionsSelectors } from '@osf/shared/stores/regions';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { UpdateRegion } from '../../store';

import { DefaultStorageLocationComponent } from './default-storage-location.component';

describe('DefaultStorageLocationComponent', () => {
  let component: DefaultStorageLocationComponent;
  let fixture: ComponentFixture<DefaultStorageLocationComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;

  const regions: IdNameModel[] = [
    { id: 'us', name: 'United States' },
    { id: 'ca', name: 'Canada' },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
    { selector: RegionsSelectors.getRegions, value: regions },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DefaultStorageLocationComponent],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DefaultStorageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should set selected region from current user default region', () => {
    setup();

    expect(component.selectedRegion()).toEqual({ id: 'us', name: 'United States' });
  });

  it('should keep selected region undefined when user is null', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: null }],
    });

    expect(component.selectedRegion()).toBeUndefined();
  });

  it('should not update location when selected region has no id', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.selectedRegion.set(undefined);

    component.updateLocation();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateRegion));
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should update region and show success toast when selected region exists', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.selectedRegion.set({ id: 'ca', name: 'Canada' });

    component.updateLocation();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateRegion('ca'));
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.defaultStorageLocation.successUpdate'
    );
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should keep selected region undefined when default region is not found', () => {
    setup({
      selectorOverrides: [
        {
          selector: UserSelectors.getCurrentUser,
          value: { ...MOCK_USER, defaultRegionId: 'unknown' },
        },
      ],
    });

    expect(component.selectedRegion()).toBeUndefined();
  });
});
