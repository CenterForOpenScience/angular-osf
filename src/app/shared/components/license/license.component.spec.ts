import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { LicenseModel, LicenseOptions, LicenseState } from '@osf/shared/models/license/license.model';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { TextInputComponent } from '../text-input/text-input.component';
import { TruncatedTextComponent } from '../truncated-text/truncated-text.component';

import { LicenseComponent } from './license.component';

describe('LicenseComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;

  const licenseWithoutFields: LicenseModel = {
    ...MOCK_LICENSE,
    id: 'license-1',
    name: 'MIT License',
    requiredFields: [],
    text: 'MIT License text',
  };

  const licenseWithFields: LicenseModel = MOCK_LICENSE;

  const mockLicenses: LicenseModel[] = [licenseWithoutFields, licenseWithFields];

  const mockLicenseOptions: LicenseOptions = {
    year: '2024',
    copyrightHolders: 'John Doe',
  };

  interface SetupOverrides {
    selectedLicenseId?: string | null;
    selectedLicenseOptions?: LicenseOptions | null;
    showInternalButtons?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [LicenseComponent, ...MockComponents(TextInputComponent, TruncatedTextComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('licenses', mockLicenses);
    fixture.componentRef.setInput('selectedLicenseId', overrides.selectedLicenseId ?? null);
    fixture.componentRef.setInput('selectedLicenseOptions', overrides.selectedLicenseOptions ?? null);
    fixture.componentRef.setInput('showInternalButtons', overrides.showInternalButtons ?? true);
    fixture.detectChanges();
  }

  it('should initialize license form with current year and empty copyright holders', () => {
    setup();

    expect(component.licenseForm.controls.year.value).toBe(new Date().getFullYear().toString());
    expect(component.licenseForm.controls.copyrightHolders.value).toBe('');
  });

  it('should sync selectedLicense from selectedLicenseId', () => {
    setup({ selectedLicenseId: licenseWithoutFields.id });

    expect(component.selectedLicense()).toEqual(licenseWithoutFields);
  });

  it('should clear selectedLicense when selectedLicenseId is not in licenses', () => {
    setup({ selectedLicenseId: 'missing-id' });

    expect(component.selectedLicense()).toBeNull();
  });

  it('should emit selectLicense and keep pending selection until id updates', () => {
    setup();
    const emitSpy = vi.spyOn(component.selectLicense, 'emit');

    component.onSelectLicense(licenseWithFields);

    expect(emitSpy).toHaveBeenCalledWith(licenseWithFields);
    expect(component.selectedLicense()).toEqual(licenseWithFields);
  });

  it('should patch form when selectedLicenseOptions change', () => {
    setup({ selectedLicenseOptions: mockLicenseOptions });

    expect(component.licenseForm.controls.year.value).toBe('2024');
    expect(component.licenseForm.controls.copyrightHolders.value).toBe('John Doe');
  });

  it('should emit licenseStateChange with form values', () => {
    setup({ selectedLicenseOptions: mockLicenseOptions });
    const states: LicenseState[] = [];

    component.licenseStateChange.subscribe((state) => states.push(state));
    component.licenseForm.patchValue({
      year: '2025',
      copyrightHolders: 'Jane Doe',
    });

    expect(states.at(-1)).toEqual({
      licenseOptions: {
        year: '2025',
        copyrightHolders: 'Jane Doe',
      },
      formInvalid: false,
    });
  });

  it('should emit createLicense when save is called with valid form', () => {
    setup({ selectedLicenseId: licenseWithFields.id });
    const emitSpy = vi.spyOn(component.createLicense, 'emit');

    component.licenseForm.patchValue(mockLicenseOptions);
    component.saveLicense();

    expect(emitSpy).toHaveBeenCalledWith({
      id: licenseWithFields.id,
      licenseOptions: mockLicenseOptions,
    });
  });

  it('should not emit createLicense when form is invalid', () => {
    setup({ selectedLicenseId: licenseWithFields.id });
    const emitSpy = vi.spyOn(component.createLicense, 'emit');

    component.licenseForm.patchValue({
      year: '',
      copyrightHolders: '',
    });
    component.saveLicense();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit createLicense when no license is selected', () => {
    setup();
    const emitSpy = vi.spyOn(component.createLicense, 'emit');

    component.licenseForm.patchValue(mockLicenseOptions);
    component.saveLicense();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should reset form to defaults when cancel is called without selected options', () => {
    setup();
    component.licenseForm.patchValue({
      year: '2023',
      copyrightHolders: 'Test Holder',
    });

    component.cancel();

    expect(component.licenseForm.controls.year.value).toBe(new Date().getFullYear().toString());
    expect(component.licenseForm.controls.copyrightHolders.value).toBe('');
  });

  it('should restore selectedLicenseOptions when cancel is called', () => {
    setup({ selectedLicenseOptions: mockLicenseOptions });
    component.licenseForm.patchValue({
      year: '2020',
      copyrightHolders: 'Changed',
    });

    component.cancel();

    expect(component.licenseForm.controls.year.value).toBe('2024');
    expect(component.licenseForm.controls.copyrightHolders.value).toBe('John Doe');
  });

  it('should toggle saveButtonDisabled based on whether form matches selected options', () => {
    setup({
      selectedLicenseId: licenseWithFields.id,
      selectedLicenseOptions: mockLicenseOptions,
    });

    expect(component.saveButtonDisabled()).toBe(true);

    component.licenseForm.patchValue({
      year: '2025',
      copyrightHolders: 'Jane Doe',
    });
    fixture.detectChanges();

    expect(component.saveButtonDisabled()).toBe(false);
  });

  it('should keep save enabled and form valid when license has no required fields', () => {
    setup({
      selectedLicenseId: licenseWithoutFields.id,
      selectedLicenseOptions: mockLicenseOptions,
    });

    expect(component.hasRequiredFields()).toBe(false);
    expect(component.licenseForm.valid).toBe(true);
    expect(component.saveButtonDisabled()).toBe(false);
  });

  it('should require year and copyright holders when license has required fields', () => {
    setup({ selectedLicenseId: licenseWithFields.id });

    expect(component.hasRequiredFields()).toBe(true);
    expect(component.licenseForm.invalid).toBe(true);

    component.licenseForm.patchValue(mockLicenseOptions);

    expect(component.licenseForm.valid).toBe(true);
  });

  it('should render internal buttons only when showInternalButtons is true', () => {
    setup({ selectedLicenseId: licenseWithFields.id });
    expect(fixture.nativeElement.querySelectorAll('p-button').length).toBe(2);

    setup({
      selectedLicenseId: licenseWithFields.id,
      showInternalButtons: false,
    });
    expect(fixture.nativeElement.querySelectorAll('p-button').length).toBe(0);
  });

  it('should show year required error when year control is invalid and dirty', () => {
    setup({ selectedLicenseId: licenseWithFields.id });

    component.licenseForm.controls.year.setValue('');
    component.licenseForm.controls.year.markAsDirty();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('p-message');
    expect(message).toBeTruthy();
    expect(message.textContent).toContain(INPUT_VALIDATION_MESSAGES.required);
  });
});
