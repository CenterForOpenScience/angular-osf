import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsDialogComponent } from './contributors-dialog.component';

describe('ContributorsDialogComponent', () => {
  let component: ContributorsDialogComponent;
  let fixture: ComponentFixture<ContributorsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
