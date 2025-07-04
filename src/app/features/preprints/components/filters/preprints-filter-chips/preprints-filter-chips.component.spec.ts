import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsFilterChipsComponent } from './preprints-filter-chips.component';

describe('PreprintsFilterChipsComponent', () => {
  let component: PreprintsFilterChipsComponent;
  let fixture: ComponentFixture<PreprintsFilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsFilterChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
