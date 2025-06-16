import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModeratorDialogComponent } from './add-moderator-dialog.component';

describe('AddModeratorDialogComponent', () => {
  let component: AddModeratorDialogComponent;
  let fixture: ComponentFixture<AddModeratorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModeratorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
