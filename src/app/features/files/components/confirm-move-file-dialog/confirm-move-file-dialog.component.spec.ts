import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMoveFileDialogComponent } from './confirm-move-file-dialog.component';

describe('ConfirmMoveFileDialogComponent', () => {
  let component: ConfirmMoveFileDialogComponent;
  let fixture: ComponentFixture<ConfirmMoveFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmMoveFileDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmMoveFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
