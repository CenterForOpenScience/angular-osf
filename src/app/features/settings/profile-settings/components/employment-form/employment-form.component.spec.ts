import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentFormComponent } from './employment-form.component';

describe('EmploymentFormComponent', () => {
  let component: EmploymentFormComponent;
  let fixture: ComponentFixture<EmploymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
