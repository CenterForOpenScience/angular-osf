import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnregisteredContributorDialogComponent } from './add-unregistered-contributor-dialog.component';

describe('AddUnregisteredContributorDialogComponent', () => {
  let component: AddUnregisteredContributorDialogComponent;
  let fixture: ComponentFixture<AddUnregisteredContributorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnregisteredContributorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUnregisteredContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
