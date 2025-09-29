import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesLicenseComponent } from './registries-license.component';

describe('LicenseComponent', () => {
  let component: RegistriesLicenseComponent;
  let fixture: ComponentFixture<RegistriesLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesLicenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
