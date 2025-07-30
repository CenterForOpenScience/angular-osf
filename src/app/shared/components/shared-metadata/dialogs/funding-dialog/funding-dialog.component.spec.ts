import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingDialogComponent } from './funding-dialog.component';

describe('FundingDialogComponent', () => {
  let component: FundingDialogComponent;
  let fixture: ComponentFixture<FundingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundingDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
