import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributorDialogComponent } from './add-contributor-dialog.component';

describe('AddContributorDialogComponent', () => {
  let component: AddContributorDialogComponent;
  let fixture: ComponentFixture<AddContributorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContributorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
