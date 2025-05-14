import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsComponent } from './affiliated-institutions.component';

describe('AffiliatedInstitutionsComponent', () => {
  let component: AffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
