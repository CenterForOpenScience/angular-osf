import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateDialogComponent } from './duplicate-dialog.component';

describe.skip('DuplicateDialogComponent', () => {
  let component: DuplicateDialogComponent;
  let fixture: ComponentFixture<DuplicateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
