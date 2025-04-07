import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFiltersComponent } from './resource-filters.component';

describe('ResourceFiltersComponent', () => {
  let component: ResourceFiltersComponent;
  let fixture: ComponentFixture<ResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
