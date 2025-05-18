import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionFilterComponent } from './institution-filter.component';

describe('InstitutionFilterComponent', () => {
  let component: InstitutionFilterComponent;
  let fixture: ComponentFixture<InstitutionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
