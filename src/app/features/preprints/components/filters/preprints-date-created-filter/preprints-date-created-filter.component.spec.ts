import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsDateCreatedFilterComponent } from './preprints-date-created-filter.component';

describe('PreprintsDateCreatedFilterComponent', () => {
  let component: PreprintsDateCreatedFilterComponent;
  let fixture: ComponentFixture<PreprintsDateCreatedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsDateCreatedFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsDateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
