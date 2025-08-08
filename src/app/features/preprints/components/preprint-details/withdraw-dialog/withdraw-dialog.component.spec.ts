import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawDialogComponent } from './withdraw-dialog.component';

describe.skip('WithdrawDialogComponent', () => {
  let component: WithdrawDialogComponent;
  let fixture: ComponentFixture<WithdrawDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
