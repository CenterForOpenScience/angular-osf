import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeDecisionDialogComponent } from './make-decision-dialog.component';

describe('MakeDecisionDialogComponent', () => {
  let component: MakeDecisionDialogComponent;
  let fixture: ComponentFixture<MakeDecisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeDecisionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDecisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
