import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_DEVELOPER_APP } from '@testing/mocks/developer-app.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { CreateDeveloperApp, DeveloperAppsSelectors, UpdateDeveloperApp } from '../../store';

import { DeveloperAppAddEditFormComponent } from './developer-app-add-edit-form.component';

describe('DeveloperAppAddEditFormComponent', () => {
  let component: DeveloperAppAddEditFormComponent;
  let fixture: ComponentFixture<DeveloperAppAddEditFormComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let toastService: ToastServiceMockType;
  let dialogRef: DynamicDialogRef;

  function setup(isLoading = false) {
    routerMock = RouterMockBuilder.create().build();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DeveloperAppAddEditFormComponent, MockComponent(TextInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ToastService, toastService),
        provideDynamicDialogRefMock(),
        provideMockStore({
          signals: [{ selector: DeveloperAppsSelectors.isLoading, value: isLoading }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(DeveloperAppAddEditFormComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should patch form with initial values on init', () => {
    setup();
    fixture.componentRef.setInput('initialValues', MOCK_DEVELOPER_APP);
    fixture.detectChanges();

    expect(component.appForm.getRawValue()).toEqual({
      name: MOCK_DEVELOPER_APP.name,
      description: MOCK_DEVELOPER_APP.description,
      projHomePageUrl: MOCK_DEVELOPER_APP.projHomePageUrl,
      authorizationCallbackUrl: MOCK_DEVELOPER_APP.authorizationCallbackUrl,
    });
  });

  it('should disable form when loading is true', () => {
    setup(true);
    fixture.detectChanges();

    expect(component.appForm.disabled).toBe(true);
  });

  it('should mark all controls touched and dirty when submit is invalid', () => {
    setup();
    fixture.detectChanges();
    component.appForm.patchValue({
      name: '',
      projHomePageUrl: '',
      authorizationCallbackUrl: '',
    });

    component.handleSubmitForm();

    expect(component.appForm.touched).toBe(true);
    Object.values(component.appForm.controls).forEach((control) => {
      expect(control.dirty).toBe(true);
    });
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateDeveloperApp));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateDeveloperApp));
  });

  it('should dispatch create action and close dialog in create mode', () => {
    setup();
    fixture.detectChanges();
    (store.dispatch as Mock).mockClear();

    component.appForm.patchValue({
      name: 'My App',
      description: 'desc',
      projHomePageUrl: 'https://example.com',
      authorizationCallbackUrl: 'https://example.com/callback',
    });

    component.handleSubmitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateDeveloperApp({
        name: 'My App',
        description: 'desc',
        projHomePageUrl: 'https://example.com',
        authorizationCallbackUrl: 'https://example.com/callback',
      })
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.developerApps.form.createSuccess');
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should dispatch update action and navigate in edit mode', () => {
    setup();
    fixture.componentRef.setInput('isEditMode', true);
    fixture.componentRef.setInput('initialValues', MOCK_DEVELOPER_APP);
    fixture.detectChanges();
    (store.dispatch as Mock).mockClear();

    component.appForm.patchValue({
      name: 'Updated App',
      description: 'updated description',
      projHomePageUrl: 'https://updated.example.com',
      authorizationCallbackUrl: 'https://updated.example.com/callback',
    });

    component.handleSubmitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateDeveloperApp(MOCK_DEVELOPER_APP.clientId, {
        id: MOCK_DEVELOPER_APP.id,
        name: 'Updated App',
        description: 'updated description',
        projHomePageUrl: 'https://updated.example.com',
        authorizationCallbackUrl: 'https://updated.example.com/callback',
      })
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.developerApps.form.updateSuccess');
    expect(routerMock.navigate).toHaveBeenCalledWith(['settings/developer-apps']);
  });
});
