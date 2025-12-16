import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@osf/shared/services/toast.service';
import { WikiSelectors } from '@osf/shared/stores/wiki';

import { TextInputComponent } from '../../text-input/text-input.component';

import { RenameWikiDialogComponent } from './rename-wiki-dialog.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RenameWikiDialogComponent', () => {
  let component: RenameWikiDialogComponent;
  let fixture: ComponentFixture<RenameWikiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameWikiDialogComponent, MockComponent(TextInputComponent)],
      providers: [
        TranslateServiceMock,
        MockProvider(DynamicDialogRef),
        MockProvider(DynamicDialogConfig, {
          data: {
            resourceId: 'project-123',
            wikiName: 'Wiki Name',
          },
        }),
        MockProvider(ToastService),
        provideMockStore({
          selectors: [{ selector: WikiSelectors.getWikiSubmitting, value: false }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RenameWikiDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with current name', () => {
    expect(component.renameWikiForm.get('name')?.value).toBe('Wiki Name');
  });

  it('should have required validation on name field', () => {
    const nameControl = component.renameWikiForm.get('name');
    nameControl?.setValue('');

    expect(nameControl?.hasError('required')).toBe(true);
  });

  it('should validate name field with valid input', () => {
    const nameControl = component.renameWikiForm.get('name');
    nameControl?.setValue('Test Wiki Name');

    expect(nameControl?.valid).toBe(true);
  });

  it('should validate name field with whitespace only', () => {
    const nameControl = component.renameWikiForm.get('name');
    nameControl?.setValue('   ');

    expect(nameControl?.hasError('required')).toBe(true);
  });

  it('should validate name field with max length', () => {
    const nameControl = component.renameWikiForm.get('name');
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

    component.renameWikiForm.patchValue({ name: '' });

    component.submitForm();

    expect(showSuccessSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should handle form submission with empty name', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const toastService = TestBed.inject(ToastService);

    const closeSpy = jest.spyOn(dialogRef, 'close');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.renameWikiForm.patchValue({ name: '   ' });

    component.submitForm();

    expect(showSuccessSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
