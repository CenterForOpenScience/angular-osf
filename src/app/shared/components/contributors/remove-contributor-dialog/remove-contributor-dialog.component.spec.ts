import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { RemoveContributorDialogComponent } from './remove-contributor-dialog.component';

describe('RemoveContributorDialogComponent', () => {
  let component: RemoveContributorDialogComponent;
  let fixture: ComponentFixture<RemoveContributorDialogComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RemoveContributorDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: { name: 'John Doe', hasChildren: true } }),
      ],
    });

    fixture = TestBed.createComponent(RemoveContributorDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass name from config', () => {
    expect(component.name).toBe('John Doe');
  });

  it('should close dialog with selected option on confirm', () => {
    component.selectedOption = true;
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog without value on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
