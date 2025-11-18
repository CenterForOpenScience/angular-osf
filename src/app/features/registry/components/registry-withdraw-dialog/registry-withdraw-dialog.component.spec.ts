import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { WithdrawRegistration } from '@osf/features/registry/store/registry';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { RegistryWithdrawDialogComponent } from './registry-withdraw-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryWithdrawDialogComponent', () => {
  let component: RegistryWithdrawDialogComponent;
  let fixture: ComponentFixture<RegistryWithdrawDialogComponent>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let store: Store;

  beforeEach(async () => {
    mockDialogConfig = {
      data: { registryId: 'test-registry-id' },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [RegistryWithdrawDialogComponent, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({ signals: [] }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryWithdrawDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should dispatch WithdrawRegistration action with correct parameters', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    const justification = 'Test withdrawal justification';
    component.form.controls.text.setValue(justification);

    component.withdrawRegistration();

    expect(dispatchSpy).toHaveBeenCalledWith(new WithdrawRegistration('test-registry-id', justification));
  });

  it('should close dialog after withdrawal completes', fakeAsync(() => {
    const closeSpy = jest.spyOn(dialogRef, 'close');
    jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.controls.text.setValue('Justification');

    component.withdrawRegistration();
    tick();

    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should set submitting to false after withdrawal completes', fakeAsync(() => {
    jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.controls.text.setValue('Justification');

    component.withdrawRegistration();
    tick();

    expect(component.submitting).toBe(false);
  }));

  it('should handle empty justification string', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.controls.text.setValue('');

    component.withdrawRegistration();

    expect(dispatchSpy).toHaveBeenCalledWith(new WithdrawRegistration('test-registry-id', ''));
  });

  it('should not dispatch action if registryId is missing', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const config = TestBed.inject(DynamicDialogConfig);
    config.data = {};

    component.withdrawRegistration();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.submitting).toBe(false);
  });

  it('should not dispatch action if registryId is null', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const config = TestBed.inject(DynamicDialogConfig);
    config.data = { registryId: null };

    component.withdrawRegistration();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.submitting).toBe(false);
  });

  it('should not dispatch action if registryId is undefined', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const config = TestBed.inject(DynamicDialogConfig);
    config.data = { registryId: undefined };

    component.withdrawRegistration();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.submitting).toBe(false);
  });

  it('should handle different justification values', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    const justifications = [
      'Short reason',
      'Very long justification that explains in detail why this registration needs to be withdrawn',
      'Special chars: !@#$%^&*()',
    ];

    justifications.forEach((justification) => {
      component.form.controls.text.setValue(justification);
      component.withdrawRegistration();

      expect(dispatchSpy).toHaveBeenCalledWith(new WithdrawRegistration('test-registry-id', justification));
    });
  });

  it('should use empty string when form text value is null', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.controls.text.setValue(null as any);

    component.withdrawRegistration();

    expect(dispatchSpy).toHaveBeenCalledWith(new WithdrawRegistration('test-registry-id', ''));
  });
});
