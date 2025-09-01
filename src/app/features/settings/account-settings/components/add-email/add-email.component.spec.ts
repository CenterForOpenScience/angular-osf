import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailsState } from '@core/store/user-emails';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { AccountSettingsState } from '../../store';

import { AddEmailComponent } from './add-email.component';

describe('AddEmailComponent', () => {
  let component: AddEmailComponent;
  let fixture: ComponentFixture<AddEmailComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmailComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState, UserEmailsState]),
        MockProviders(DynamicDialogRef, ToastService),
        TranslateServiceMock,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmailComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call action addEmail when email is invalid', () => {
    const actionSpy = jest.spyOn(store, 'dispatch');

    component.addEmail();

    expect(actionSpy).not.toHaveBeenCalled();
  });
});
