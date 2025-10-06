import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCheckboxItemComponent } from './component-checkbox-item.component';

describe('ComponentCheckboxItemComponent', () => {
  let component: ComponentCheckboxItemComponent;
  let fixture: ComponentFixture<ComponentCheckboxItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCheckboxItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCheckboxItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
