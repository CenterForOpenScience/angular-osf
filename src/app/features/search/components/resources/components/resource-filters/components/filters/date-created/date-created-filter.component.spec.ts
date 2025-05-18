import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCreatedFilterComponent } from './date-created-filter.component';

describe('DateCreatedFilterComponent', () => {
  let component: DateCreatedFilterComponent;
  let fixture: ComponentFixture<DateCreatedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateCreatedFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
