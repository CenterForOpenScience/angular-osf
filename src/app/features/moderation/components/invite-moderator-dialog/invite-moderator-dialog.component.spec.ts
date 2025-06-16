import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteModeratorDialogComponent } from './invite-moderator-dialog.component';

describe('InviteModeratorDialogComponent', () => {
  let component: InviteModeratorDialogComponent;
  let fixture: ComponentFixture<InviteModeratorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteModeratorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
