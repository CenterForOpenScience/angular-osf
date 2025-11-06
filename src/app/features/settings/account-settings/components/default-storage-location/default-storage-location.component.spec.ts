import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors, UserState } from '@osf/core/store/user';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { RegionsSelectors, RegionsState } from '@osf/shared/stores/regions';

import { AccountSettingsState } from '../../store';

import { DefaultStorageLocationComponent } from './default-storage-location.component';

import { MOCK_STORE } from '@testing/mocks/mock-store.mock';

describe('DefaultStorageLocationComponent', () => {
  let component: DefaultStorageLocationComponent;
  let fixture: ComponentFixture<DefaultStorageLocationComponent>;
  let loaderService: LoaderService;

  const mockUser = { id: 'id1', defaultRegionId: 'region1' };
  const mockRegions = [
    { id: 'region1', name: 'Test Region' },
    { id: 'region2', name: 'Another Region' },
  ];

  beforeEach(async () => {
    const mockLoaderService = {
      show: jest.fn(),
      hide: jest.fn(),
    };

    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === UserSelectors.getCurrentUser) {
        return () => signal(mockUser);
      }
      if (selector === RegionsSelectors.getRegions) {
        return () => signal(mockRegions);
      }
      return () => signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [DefaultStorageLocationComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(ToastService),
        MockProvider(LoaderService, mockLoaderService),
        provideStore([AccountSettingsState, UserState, RegionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultStorageLocationComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not execute update when selectedRegion has no id', () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === UserSelectors.getCurrentUser) {
        return () => signal({ id: 'id1', defaultRegionId: 'non-existent' });
      }
      return () => signal(undefined);
    });

    component.updateLocation();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });
});
