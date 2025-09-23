import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsAffiliatedInstitutionsComponent } from './preprints-affiliated-institutions.component';

describe.skip('PreprintsAffiliatedInstitutionsComponent', () => {
  let component: PreprintsAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<PreprintsAffiliatedInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsAffiliatedInstitutionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsAffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
