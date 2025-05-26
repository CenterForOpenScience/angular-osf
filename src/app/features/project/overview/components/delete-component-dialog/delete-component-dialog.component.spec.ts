import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComponentDialogComponent } from './delete-component-dialog.component';

describe('DeleteComponentDialogComponent', () => {
  let component: DeleteComponentDialogComponent;
  let fixture: ComponentFixture<DeleteComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
