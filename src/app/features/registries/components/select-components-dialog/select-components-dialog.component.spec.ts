import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponentsDialogComponent } from './select-components-dialog.component';

describe('SelectComponentsDialogComponent', () => {
  let component: SelectComponentsDialogComponent;
  let fixture: ComponentFixture<SelectComponentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponentsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
