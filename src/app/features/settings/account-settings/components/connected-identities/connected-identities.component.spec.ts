import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIdentity } from '@osf/features/settings/account-settings/models';
import { CustomConfirmationService, LoaderService, ToastService } from '@shared/services';

import { AccountSettingsState } from '../../store/account-settings.state';

import { ConnectedIdentitiesComponent } from './connected-identities.component';

const mockIdentity: ExternalIdentity = {
  id: 'id1',
  externalId: 'externalId1',
  status: 'VERIFIED',
};

describe('ConnectedIdentitiesComponent', () => {
  let component: ConnectedIdentitiesComponent;
  let fixture: ComponentFixture<ConnectedIdentitiesComponent>;
  let customConfirmationService: CustomConfirmationService;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedIdentitiesComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(LoaderService, CustomConfirmationService, ToastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedIdentitiesComponent);
    customConfirmationService = TestBed.inject(CustomConfirmationService);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete external identity when confirmation accepted', () => {
    jest.spyOn(store, 'dispatch').mockReturnValue(of());

    jest.spyOn(customConfirmationService, 'confirmDelete').mockImplementation(({ onConfirm }) => onConfirm());

    component.deleteExternalIdentity(mockIdentity);

    expect(customConfirmationService.confirmDelete).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
