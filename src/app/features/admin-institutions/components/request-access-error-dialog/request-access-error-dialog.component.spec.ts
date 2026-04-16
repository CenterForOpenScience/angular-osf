import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { RequestAccessErrorDialogComponent } from './request-access-error-dialog.component';

describe('RequestAccessErrorDialogComponent', () => {
  let component: RequestAccessErrorDialogComponent;
  let fixture: ComponentFixture<RequestAccessErrorDialogComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestAccessErrorDialogComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock()],
    });

    fixture = TestBed.createComponent(RequestAccessErrorDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject the dialog ref', () => {
    expect(component.dialogRef).toBe(dialogRef);
  });

  it('should close the dialog with true', () => {
    component.dialogRef.close(true);

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false', () => {
    component.dialogRef.close(false);

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog without a value', () => {
    component.dialogRef.close();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
