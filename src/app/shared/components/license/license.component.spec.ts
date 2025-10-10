import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseComponent, TextInputComponent } from '@shared/components';
import { MOCK_LICENSE } from '@shared/mocks';
import { LicenseModel, LicenseOptions } from '@shared/models';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('LicenseComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;

  const mockLicenses: LicenseModel[] = [
    {
      ...MOCK_LICENSE,
      id: 'license-1',
      name: 'MIT License',
      requiredFields: [],
      text: 'MIT License text',
    },
    MOCK_LICENSE,
  ];

  const mockLicenseOptions: LicenseOptions = {
    year: '2024',
    copyrightHolders: 'John Doe',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseComponent, ...MockComponents(TextInputComponent), OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('licenses', mockLicenses);
    fixture.componentRef.setInput('selectedLicenseId', null);
    fixture.componentRef.setInput('selectedLicenseOptions', null);
    fixture.componentRef.setInput('isSubmitting', false);
    fixture.componentRef.setInput('showInternalButtons', true);
    fixture.componentRef.setInput('fullWidthSelect', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set licenses input', () => {
    expect(component.licenses()).toEqual(mockLicenses);
  });

  it('should set selectedLicenseId input', () => {
    expect(component.selectedLicenseId()).toBe(null);
  });

  it('should set selectedLicenseOptions input', () => {
    expect(component.selectedLicenseOptions()).toBe(null);
  });

  it('should set isSubmitting input', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('should set showInternalButtons input', () => {
    expect(component.showInternalButtons()).toBe(true);
  });

  it('should set fullWidthSelect input', () => {
    expect(component.fullWidthSelect()).toBe(false);
  });

  it('should initialize license form with current year', () => {
    const currentYear = new Date().getFullYear().toString();
    expect(component.licenseForm.get('year')?.value).toBe(currentYear);
  });

  it('should initialize license form with empty copyright holders', () => {
    expect(component.licenseForm.get('copyrightHolders')?.value).toBe('');
  });

  it('should emit selectLicense when license without required fields is selected', () => {
    const emitSpy = jest.spyOn(component.selectLicense, 'emit');
    const license = mockLicenses[0];

    component.onSelectLicense(license);

    expect(emitSpy).toHaveBeenCalledWith(license);
  });

  it('should emit createLicense when save is called with valid form', () => {
    const emitSpy = jest.spyOn(component.createLicense, 'emit');

    component.selectedLicense.set(mockLicenses[1]);

    component.licenseForm.patchValue({
      year: '2024',
      copyrightHolders: 'John Doe',
    });

    component.saveLicense();

    expect(emitSpy).toHaveBeenCalledWith({
      id: MOCK_LICENSE.id,
      licenseOptions: {
        year: '2024',
        copyrightHolders: 'John Doe',
      },
    });
  });

  it('should not emit createLicense when form is invalid', () => {
    const emitSpy = jest.spyOn(component.createLicense, 'emit');

    component.selectedLicense.set(mockLicenses[1]);
    component.licenseForm.patchValue({
      year: '',
      copyrightHolders: '',
    });

    component.saveLicense();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should reset form when cancel is called', () => {
    component.licenseForm.patchValue({
      year: '2023',
      copyrightHolders: 'Test Holder',
    });

    component.cancel();

    expect(component.licenseForm.get('year')?.value).toBe('');
    expect(component.licenseForm.get('copyrightHolders')?.value).toBe('');
  });

  it('should update form when selectedLicenseOptions changes', () => {
    fixture.componentRef.setInput('selectedLicenseOptions', mockLicenseOptions);
    fixture.detectChanges();

    expect(component.licenseForm.get('year')?.value).toBe('2024');
    expect(component.licenseForm.get('copyrightHolders')?.value).toBe('John Doe');
  });
});
