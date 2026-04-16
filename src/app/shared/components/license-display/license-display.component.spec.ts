import { MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseModel } from '@osf/shared/models/license/license.model';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { LicenseDisplayComponent } from './license-display.component';

describe('LicenseDisplayComponent', () => {
  let component: LicenseDisplayComponent;
  let fixture: ComponentFixture<LicenseDisplayComponent>;

  const mockLicense: LicenseModel = {
    ...MOCK_LICENSE,
    name: 'MIT License',
    text: 'MIT License text with {{year}} and {{copyrightHolders}}',
  };

  const mockLicenseOptions = {
    year: '2024',
    copyrightHolders: 'John Doe',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LicenseDisplayComponent, MockPipe(InterpolatePipe)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(LicenseDisplayComponent);
    component = fixture.componentInstance;
  });

  it('should set license input with valid license data', () => {
    fixture.componentRef.setInput('license', mockLicense);
    expect(component.license()).toEqual(mockLicense);
  });

  it('should set license input with null value', () => {
    fixture.componentRef.setInput('license', null);
    expect(component.license()).toBeNull();
  });

  it('should set license input with undefined value', () => {
    fixture.componentRef.setInput('license', undefined);
    expect(component.license()).toBeUndefined();
  });

  it('should set licenseOptions input with record data', () => {
    fixture.componentRef.setInput('licenseOptions', mockLicenseOptions);
    expect(component.licenseOptions()).toEqual(mockLicenseOptions);
  });

  it('should set licenseOptions input with empty object (default)', () => {
    fixture.componentRef.setInput('licenseOptions', {});
    expect(component.licenseOptions()).toEqual({});
  });
});
