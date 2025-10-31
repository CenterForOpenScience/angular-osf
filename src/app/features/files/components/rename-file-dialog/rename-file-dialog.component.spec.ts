import { MockComponent } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';

import { RenameFileDialogComponent } from './rename-file-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RenameFileDialogComponent', () => {
  let component: RenameFileDialogComponent;
  let fixture: ComponentFixture<RenameFileDialogComponent>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: jest.Mocked<DynamicDialogConfig>;

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn(),
    };

    const dialogConfigMock = {
      data: { currentName: 'test-file.txt' },
    };

    await TestBed.configureTestingModule({
      imports: [RenameFileDialogComponent, ReactiveFormsModule, OSFTestingModule, MockComponent(TextInputComponent)],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RenameFileDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    dialogConfig = TestBed.inject(DynamicDialogConfig) as jest.Mocked<DynamicDialogConfig>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.nameMaxLength).toBe(InputLimits.title.maxLength);
    expect(component.nameMinLength).toBe(InputLimits.title.minLength);
    expect(component.renameForm).toBeDefined();
  });

  it('should initialize form with current name from config', () => {
    const nameControl = component.renameForm.get('name');
    expect(nameControl?.value).toBe('test-file.txt');
  });

  it('should be invalid when name is empty', () => {
    const nameControl = component.renameForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBe(true);
    expect(component.renameForm.invalid).toBe(true);
  });

  it('should be invalid when name contains forbidden characters', () => {
    const nameControl = component.renameForm.get('name');
    nameControl?.setValue('file@name');
    expect(nameControl?.hasError('forbiddenCharacters')).toBe(true);
  });

  it('should be invalid when name ends with period', () => {
    const nameControl = component.renameForm.get('name');
    nameControl?.setValue('filename.');
    expect(nameControl?.hasError('periodAtEnd')).toBe(true);
  });

  it('should be valid when name passes all validations', () => {
    const nameControl = component.renameForm.get('name');
    nameControl?.setValue('valid-filename');
    expect(component.renameForm.valid).toBe(true);
  });

  it('should close dialog with new name when onSubmit is called with valid form', () => {
    const nameControl = component.renameForm.get('name');
    nameControl?.setValue('new-filename.txt');

    component.onSubmit();

    expect(dialogRef.close).toHaveBeenCalledWith('new-filename.txt');
  });

  it('should not close dialog when onSubmit is called with invalid form', () => {
    const nameControl = component.renameForm.get('name');
    nameControl?.setValue('');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog without result when onCancel is called', () => {
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should have name control with correct validators', () => {
    const nameControl = component.renameForm.get('name');
    expect(nameControl).toBeDefined();
    expect(nameControl?.hasError('required')).toBe(false);
  });

  it('should handle empty config data', () => {
    dialogConfig.data = undefined;
    fixture = TestBed.createComponent(RenameFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const nameControl = component.renameForm.get('name');
    expect(nameControl?.value).toBe('');
  });
});
