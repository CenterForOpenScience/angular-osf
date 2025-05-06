import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesWrapperComponent } from './resources-wrapper.component';

describe('ResourcesWrapperComponent', () => {
  let component: ResourcesWrapperComponent;
  let fixture: ComponentFixture<ResourcesWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
