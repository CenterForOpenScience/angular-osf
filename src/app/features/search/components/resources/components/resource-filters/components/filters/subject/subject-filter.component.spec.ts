import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectFilterComponent } from './subject-filter.component';

describe('SubjectComponent', () => {
  let component: SubjectFilterComponent;
  let fixture: ComponentFixture<SubjectFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
