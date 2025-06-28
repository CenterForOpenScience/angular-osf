import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableFilterComponent } from './reusable-filter.component';

describe('ReusableFilterComponentComponent', () => {
  let component: ReusableFilterComponent;
  let fixture: ComponentFixture<ReusableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
