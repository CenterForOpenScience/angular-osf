import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceDialogComponent } from './add-resource-dialog.component';

describe('AddResourceDialogComponent', () => {
  let component: AddResourceDialogComponent;
  let fixture: ComponentFixture<AddResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResourceDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
