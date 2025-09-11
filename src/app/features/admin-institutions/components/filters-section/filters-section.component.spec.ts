import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSectionComponent } from './filters-section.component';

describe.skip('FiltersSectionComponent', () => {
  let component: FiltersSectionComponent;
  let fixture: ComponentFixture<FiltersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
