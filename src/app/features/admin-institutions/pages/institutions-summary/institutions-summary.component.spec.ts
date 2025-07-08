import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsSummaryComponent } from './institutions-summary.component';

describe('InstitutionsSummaryComponent', () => {
  let component: InstitutionsSummaryComponent;
  let fixture: ComponentFixture<InstitutionsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
