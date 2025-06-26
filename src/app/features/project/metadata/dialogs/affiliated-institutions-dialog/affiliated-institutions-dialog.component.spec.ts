import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsDialogComponent } from './affiliated-institutions-dialog.component';

describe('AffiliatedInstitutionsDialogComponent', () => {
  let component: AffiliatedInstitutionsDialogComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliatedInstitutionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
