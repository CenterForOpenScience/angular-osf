import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { DeactivationWarningComponent } from './deactivation-warning.component';

describe('DeactivationWarningComponent', () => {
  let component: DeactivationWarningComponent;
  let fixture: ComponentFixture<DeactivationWarningComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeactivationWarningComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock()],
    });

    fixture = TestBed.createComponent(DeactivationWarningComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when deactivateAccount is called', () => {
    component.deactivateAccount();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
