import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInfoTooltipComponent } from './resource-tooltip-info.component';

describe.skip('ResourceInfoTooltipComponent', () => {
  let component: ResourceInfoTooltipComponent;
  let fixture: ComponentFixture<ResourceInfoTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceInfoTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceInfoTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
