import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { RegistrationWithdrawDialogComponent } from './registration-withdraw-dialog.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

function setup(registryId = 'reg-123') {
  TestBed.configureTestingModule({
    imports: [RegistrationWithdrawDialogComponent, MockComponent(TextInputComponent)],
    providers: [
      provideOSFCore(),
      provideDynamicDialogRefMock(),
      MockProvider(DynamicDialogConfig, { data: { registryId } }),
      provideMockStore(),
    ],
  });

  const store = TestBed.inject(Store);
  const dialogRef = TestBed.inject(DynamicDialogRef);
  const fixture = TestBed.createComponent(RegistrationWithdrawDialogComponent);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance, store, dialogRef };
}

describe('RegistrationWithdrawDialogComponent', () => {
  it('should create with default form state', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.submitting()).toBe(false);
    expect(component.form.controls.text.value).toBe('');
  });

  it('should dispatch withdraw and close dialog on success', () => {
    const { component, store, dialogRef } = setup();
    jest.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    component.form.controls.text.setValue('Withdrawal reason');
    component.withdrawRegistration();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        registryId: 'reg-123',
        justification: 'Withdrawal reason',
      })
    );
    expect(component.submitting()).toBe(false);
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not close dialog on dispatch error', () => {
    const { component, store, dialogRef } = setup();
    jest.spyOn(store, 'dispatch').mockReturnValue(throwError(() => new Error('fail')));

    component.form.controls.text.setValue('Reason');
    component.withdrawRegistration();

    expect(component.submitting()).toBe(false);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should not dispatch when registryId is missing', () => {
    const { component, store, dialogRef } = setup('');

    component.withdrawRegistration();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
