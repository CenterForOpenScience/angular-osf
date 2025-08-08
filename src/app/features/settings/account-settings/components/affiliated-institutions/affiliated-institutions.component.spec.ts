import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';
import { MOCK_INSTITUTION } from '@shared/mocks/institution.mock';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { AccountSettingsState } from '../../store';

import { AffiliatedInstitutionsComponent } from './affiliated-institutions.component';

describe('AffiliatedInstitutionsComponent', () => {
  let component: AffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsComponent>;
  let confirmationService: CustomConfirmationService;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState, UserState]),
        MockProviders(CustomConfirmationService, ToastService, DynamicDialogRef),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsComponent);
    component = fixture.componentInstance;

    confirmationService = TestBed.inject(CustomConfirmationService);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteInstitution on confirmation', () => {
    jest.spyOn(confirmationService, 'confirmDelete').mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.deleteInstitution(MOCK_INSTITUTION);

    expect(confirmationService.confirmDelete).toHaveBeenCalled();
  });

  it('should not dispatch delete when user cancels confirmation', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    jest.spyOn(confirmationService, 'confirmDelete').mockImplementation(() => {
      // Simulate cancelling the confirmation
    });

    component.deleteInstitution(MOCK_INSTITUTION);

    expect(confirmationService.confirmDelete).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
