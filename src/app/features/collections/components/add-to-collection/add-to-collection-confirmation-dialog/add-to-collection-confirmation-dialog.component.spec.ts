import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionConfirmationDialogComponent } from './add-to-collection-confirmation-dialog.component';

describe('AddToCollectionConfirmationDialogComponent', () => {
  let component: AddToCollectionConfirmationDialogComponent;
  let fixture: ComponentFixture<AddToCollectionConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCollectionConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCollectionConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
