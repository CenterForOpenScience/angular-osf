import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveContributorDialogComponent } from './remove-contributor-dialog.component';

describe('RemoveContributorDialogComponent', () => {
  let component: RemoveContributorDialogComponent;
  let fixture: ComponentFixture<RemoveContributorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveContributorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
