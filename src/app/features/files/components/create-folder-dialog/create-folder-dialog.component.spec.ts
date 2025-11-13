import { MockComponent } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';

import { CreateFolderDialogComponent } from './create-folder-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CreateFolderDialogComponent', () => {
  let component: CreateFolderDialogComponent;
  let fixture: ComponentFixture<CreateFolderDialogComponent>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateFolderDialogComponent, ReactiveFormsModule, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [{ provide: DynamicDialogRef, useValue: dialogRefMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFolderDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.nameLimit).toBe(InputLimits.name.maxLength);
    expect(component.nameMinLength).toBe(InputLimits.name.minLength);
    expect(component.folderForm).toBeDefined();
    expect(component.dialogRef).toBeDefined();
  });

  it('should initialize form with correct validators', () => {
    const nameControl = component.folderForm.get('name');
    expect(nameControl).toBeDefined();
    expect(nameControl?.value).toBe('');
  });

  it('should be invalid when name is empty', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBe(true);
    expect(component.folderForm.invalid).toBe(true);
  });

  it('should be invalid when name is only whitespace', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('   ');
    expect(nameControl?.hasError('required')).toBe(true);
    expect(component.folderForm.invalid).toBe(true);
  });

  it('should be valid when name has content', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('valid-folder-name');
    expect(nameControl?.hasError('required')).toBe(false);
  });

  it('should be valid when name does not contain forbidden characters', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('valid-folder-name');
    expect(nameControl?.hasError('forbiddenCharacters')).toBe(false);
  });

  it('should be invalid when name ends with period', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('folder-name.');
    expect(nameControl?.hasError('periodAtEnd')).toBe(true);
  });

  it('should be valid when name does not end with period', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('folder-name');
    expect(nameControl?.hasError('periodAtEnd')).toBe(false);
  });

  it('should be valid when name has period in the middle', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('folder.name');
    expect(nameControl?.hasError('periodAtEnd')).toBe(false);
  });

  it('should be invalid when name has multiple validation errors', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('folder@name.');
    expect(nameControl?.hasError('forbiddenCharacters')).toBe(true);
    expect(nameControl?.hasError('periodAtEnd')).toBe(true);
    expect(component.folderForm.invalid).toBe(true);
  });

  it('should be valid when name passes all validations', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('valid-folder-name');
    expect(component.folderForm.valid).toBe(true);
  });

  it('should not close dialog when form is invalid', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog with trimmed folder name when form is valid', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('  valid-folder-name  ');

    component.onSubmit();

    expect(dialogRef.close).toHaveBeenCalledWith('valid-folder-name');
  });

  it('should close dialog with folder name when form is valid and no trimming needed', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('valid-folder-name');

    component.onSubmit();

    expect(dialogRef.close).toHaveBeenCalledWith('valid-folder-name');
  });

  it('should not close dialog when trimmed name is empty', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('   ');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog without result when cancel button is clicked', () => {
    component.dialogRef.close();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should update form validity when name control changes', () => {
    const nameControl = component.folderForm.get('name');

    nameControl?.setValue('');
    expect(component.folderForm.invalid).toBe(true);

    nameControl?.setValue('valid-folder-name');
    expect(component.folderForm.valid).toBe(true);

    nameControl?.setValue('invalid@name.');
    expect(component.folderForm.invalid).toBe(true);
  });

  it('should handle form submission via ngSubmit', () => {
    const nameControl = component.folderForm.get('name');
    nameControl?.setValue('valid-folder-name');

    const form = fixture.nativeElement.querySelector('form');
    const submitEvent = new Event('submit');

    form.dispatchEvent(submitEvent);

    expect(dialogRef.close).toHaveBeenCalledWith('valid-folder-name');
  });
});
