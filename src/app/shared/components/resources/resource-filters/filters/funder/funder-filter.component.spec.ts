import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunderFilterComponent } from './funder-filter.component';

describe('FunderComponent', () => {
  let component: FunderFilterComponent;
  let fixture: ComponentFixture<FunderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunderFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FunderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
