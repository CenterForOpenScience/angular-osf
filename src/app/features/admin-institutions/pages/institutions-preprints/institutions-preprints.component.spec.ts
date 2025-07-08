import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsPreprintsComponent } from './institutions-preprints.component';

describe('InstitutionsPreprintsComponent', () => {
  let component: InstitutionsPreprintsComponent;
  let fixture: ComponentFixture<InstitutionsPreprintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsPreprintsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsPreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
