import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { EditTitleDialogComponent } from './edit-title-dialog.component';

describe('EditTitleDialogComponent', () => {
  let component: EditTitleDialogComponent;
  let fixture: ComponentFixture<EditTitleDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditTitleDialogComponent, MockComponent(TextInputComponent)],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig)],
    });

    fixture = TestBed.createComponent(EditTitleDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty title by default', () => {
    expect(component.titleControl.value).toBe('');
  });

  it('should initialize with config data if provided', () => {
    const testTitle = 'Test Title';
    config.data = testTitle;

    fixture = TestBed.createComponent(EditTitleDialogComponent);
    component = fixture.componentInstance;

    expect(component.titleControl.value).toBe(testTitle);
  });

  it('should close dialog with title value on save', () => {
    const testTitle = 'New Project Title';
    component.titleControl.setValue(testTitle);

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({ value: testTitle });
  });

  it('should close dialog without data on cancel', () => {
    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should validate that title is required', () => {
    component.titleControl.setValue('');

    expect(component.titleControl.invalid).toBe(true);
  });

  it('should validate that title with only whitespace is invalid', () => {
    component.titleControl.setValue('   ');

    expect(component.titleControl.invalid).toBe(true);
  });

  it('should validate that title with text is valid', () => {
    component.titleControl.setValue('Valid Title');

    expect(component.titleControl.valid).toBe(true);
  });
});
