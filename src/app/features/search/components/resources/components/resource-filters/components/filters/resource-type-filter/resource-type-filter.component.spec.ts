import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTypeFilterComponent } from './resource-type-filter.component';

describe('ResourceTypeFilterComponent', () => {
  let component: ResourceTypeFilterComponent;
  let fixture: ComponentFixture<ResourceTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceTypeFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
