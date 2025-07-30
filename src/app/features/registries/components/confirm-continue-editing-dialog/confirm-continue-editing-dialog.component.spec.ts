import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmContinueEditingDialogComponent } from './confirm-continue-editing-dialog.component';

describe('ConfirmContinueEditingDialogComponent', () => {
  let component: ConfirmContinueEditingDialogComponent;
  let fixture: ComponentFixture<ConfirmContinueEditingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmContinueEditingDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmContinueEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
