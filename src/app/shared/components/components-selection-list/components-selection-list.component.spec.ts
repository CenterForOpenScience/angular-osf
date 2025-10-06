import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsSelectionListComponent } from './components-selection-list.component';

describe('ComponentsSelectionListComponent', () => {
  let component: ComponentsSelectionListComponent;
  let fixture: ComponentFixture<ComponentsSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsSelectionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
