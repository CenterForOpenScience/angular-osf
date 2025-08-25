import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_LICENSE, TranslateServiceMock } from '@shared/mocks';

import { ProjectMetadataLicenseComponent } from './project-metadata-license.component';

describe('ProjectMetadataLicenseComponent', () => {
  let component: ProjectMetadataLicenseComponent;
  let fixture: ComponentFixture<ProjectMetadataLicenseComponent>;

  const mockLicense = MOCK_LICENSE;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetadataLicenseComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataLicenseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.hideEditLicense()).toBe(false);
  });

  it('should set license input', () => {
    fixture.componentRef.setInput('license', mockLicense);
    fixture.detectChanges();

    expect(component.license()).toEqual(mockLicense);
  });

  it('should set hideEditLicense input', () => {
    fixture.componentRef.setInput('hideEditLicense', true);
    fixture.detectChanges();

    expect(component.hideEditLicense()).toBe(true);
  });

  it('should emit openEditLicenseDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditLicenseDialog, 'emit');

    component.openEditLicenseDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
