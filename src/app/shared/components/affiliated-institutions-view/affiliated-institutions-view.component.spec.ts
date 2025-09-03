import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsViewComponent } from './affiliated-institutions-view.component';

describe.skip('AffiliatedInstitutionsViewComponent', () => {
  let component: AffiliatedInstitutionsViewComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
