import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormComponent } from './resource-form.component';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
