import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { CancelDeactivationComponent } from './cancel-deactivation.component';

describe('CancelDeactivationComponent', () => {
  let component: CancelDeactivationComponent;
  let fixture: ComponentFixture<CancelDeactivationComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CancelDeactivationComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock()],
    });

    fixture = TestBed.createComponent(CancelDeactivationComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true when cancelDeactivation is called', () => {
    component.cancelDeactivation();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
