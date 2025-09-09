import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesAffiliatedInstitutionComponent } from './registries-affiliated-institution.component';

describe.skip('RegistriesAffiliatedInstitutionComponent', () => {
  let component: RegistriesAffiliatedInstitutionComponent;
  let fixture: ComponentFixture<RegistriesAffiliatedInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesAffiliatedInstitutionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesAffiliatedInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
