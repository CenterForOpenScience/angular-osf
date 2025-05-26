import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponentDialogComponent } from './add-component-dialog.component';

describe('AddComponentComponent', () => {
  let component: AddComponentDialogComponent;
  let fixture: ComponentFixture<AddComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComponentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
