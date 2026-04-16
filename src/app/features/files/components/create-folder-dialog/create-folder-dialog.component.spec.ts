import { MockComponent } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { CreateFolderDialogComponent } from './create-folder-dialog.component';

describe('CreateFolderDialogComponent', () => {
  let component: CreateFolderDialogComponent;
  let fixture: ComponentFixture<CreateFolderDialogComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateFolderDialogComponent, MockComponent(TextInputComponent)],
      providers: [provideOSFCore(), provideDynamicDialogRefMock()],
    });

    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(CreateFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose name limits from shared input limits', () => {
    expect(component.nameLimit).toBe(InputLimits.name.maxLength);
    expect(component.nameMinLength).toBe(InputLimits.name.minLength);
  });

  it('should not close dialog when form is invalid', () => {
    component.folderForm.controls.name.setValue('');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog with trimmed folder name when form is valid', () => {
    component.folderForm.controls.name.setValue('  New Folder  ');

    component.onSubmit();

    expect(dialogRef.close).toHaveBeenCalledWith('New Folder');
  });

  it('should not close dialog when value contains forbidden characters', () => {
    component.folderForm.controls.name.setValue('Invalid/Name');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should not close dialog when value ends with period', () => {
    component.folderForm.controls.name.setValue('Folder.');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
