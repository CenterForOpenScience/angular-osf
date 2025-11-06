import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataLicenseComponent } from './metadata-license.component';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataLicenseComponent', () => {
  let component: MetadataLicenseComponent;
  let fixture: ComponentFixture<MetadataLicenseComponent>;

  const mockLicense = MOCK_LICENSE;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataLicenseComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataLicenseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.readonly()).toBe(false);
    expect(component.license()).toBe(null);
  });

  it('should set license input', () => {
    fixture.componentRef.setInput('license', mockLicense);
    fixture.detectChanges();

    expect(component.license()).toEqual(mockLicense);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit openEditLicenseDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditLicenseDialog, 'emit');

    component.openEditLicenseDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
