import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionTableComponent } from './accordion-table.component';

describe('AccordionTableComponent', () => {
  let component: AccordionTableComponent;
  let fixture: ComponentFixture<AccordionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
