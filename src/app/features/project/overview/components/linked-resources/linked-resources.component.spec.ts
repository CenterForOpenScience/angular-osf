import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedResourcesComponent } from './linked-resources.component';

describe('LinkedProjectsComponent', () => {
  let component: LinkedResourcesComponent;
  let fixture: ComponentFixture<LinkedResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
