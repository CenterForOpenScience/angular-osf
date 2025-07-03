import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsResourcesFiltersComponent } from '@osf/features/preprints/components';

describe('PreprintsResourcesFiltersComponent', () => {
  let component: PreprintsResourcesFiltersComponent;
  let fixture: ComponentFixture<PreprintsResourcesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsResourcesFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsResourcesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
