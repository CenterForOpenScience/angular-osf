import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCitationsComponent } from './resource-citations.component';

describe('ResourceCitationsComponent', () => {
  let component: ResourceCitationsComponent;
  let fixture: ComponentFixture<ResourceCitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCitationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
