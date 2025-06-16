import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHistoryDialogComponent } from './education-history-dialog.component';

describe('EducationHistoryDialogComponent', () => {
  let component: EducationHistoryDialogComponent;
  let fixture: ComponentFixture<EducationHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationHistoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
