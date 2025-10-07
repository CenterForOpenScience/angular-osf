import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { ComponentsSelectionListComponent } from './components-selection-list.component';

describe('ComponentsSelectionListComponent', () => {
  let component: ComponentsSelectionListComponent;
  let fixture: ComponentFixture<ComponentsSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsSelectionListComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsSelectionListComponent);
    fixture.componentRef.setInput('components', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
