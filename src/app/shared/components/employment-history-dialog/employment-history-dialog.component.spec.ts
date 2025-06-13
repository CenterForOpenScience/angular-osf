import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentHistoryDialogComponent } from './employment-history-dialog.component';

describe('EmploymentHistoryDialogComponent', () => {
  let component: EmploymentHistoryDialogComponent;
  let fixture: ComponentFixture<EmploymentHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentHistoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
