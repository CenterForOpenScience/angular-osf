import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintWithdrawalSubmissionsComponent } from './preprint-withdrawal-submissions.component';

describe('PreprintWithdrawalSubmissionsComponent', () => {
  let component: PreprintWithdrawalSubmissionsComponent;
  let fixture: ComponentFixture<PreprintWithdrawalSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintWithdrawalSubmissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintWithdrawalSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
