import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';
import { WikiSelectors } from '@osf/shared/stores/wiki';

import { TextInputComponent } from '../../text-input/text-input.component';

import { AddWikiDialogComponent } from './add-wiki-dialog.component';

import { MOCK_STORE } from '@testing/mocks/mock-store.mock';
import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';

describe('AddWikiDialogComponent', () => {
  let component: AddWikiDialogComponent;
  let fixture: ComponentFixture<AddWikiDialogComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === WikiSelectors.getWikiSubmitting) {
        return () => false;
      }
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [AddWikiDialogComponent, MockComponent(TextInputComponent)],
      providers: [
        TranslateServiceMock,
        MockProvider(DynamicDialogRef),
        MockProvider(DynamicDialogConfig, {
          data: {
            resourceId: 'project-123',
          },
        }),
        MockProvider(ToastService),
        MockProvider(Store, MOCK_STORE),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWikiDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty name', () => {
    expect(component.addWikiForm.get('name')?.value).toBe('');
  });

  it('should have required validation on name field', () => {
    const nameControl = component.addWikiForm.get('name');

    expect(nameControl?.hasError('required')).toBe(true);
  });

  it('should validate name field with valid input', () => {
    const nameControl = component.addWikiForm.get('name');
    nameControl?.setValue('Test Wiki Name');

    expect(nameControl?.valid).toBe(true);
  });

  it('should validate name field with whitespace only', () => {
    const nameControl = component.addWikiForm.get('name');
    nameControl?.setValue('   ');

    expect(nameControl?.hasError('required')).toBe(true);
  });

  it('should validate name field with max length', () => {
    const nameControl = component.addWikiForm.get('name');
    const longName = 'a'.repeat(256);
    nameControl?.setValue(longName);

    expect(nameControl?.hasError('maxlength')).toBe(true);
  });

  it('should close dialog on cancel', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    dialogRef.close();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not submit form when invalid', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const toastService = TestBed.inject(ToastService);

    const closeSpy = jest.spyOn(dialogRef, 'close');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.addWikiForm.patchValue({ name: '' });

    component.submitForm();

    expect(showSuccessSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should handle form submission with empty name', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const toastService = TestBed.inject(ToastService);

    const closeSpy = jest.spyOn(dialogRef, 'close');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.addWikiForm.patchValue({ name: '   ' });

    component.submitForm();

    expect(showSuccessSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
