import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionSelectComponent } from './affiliated-institution-select.component';

describe.skip('AffiliatedInstitutionSelectComponent', () => {
  let component: AffiliatedInstitutionSelectComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
