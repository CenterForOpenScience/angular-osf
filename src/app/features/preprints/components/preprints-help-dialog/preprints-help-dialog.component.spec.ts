import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsHelpDialogComponent } from './preprints-help-dialog.component';

describe('CollectionsHelpDialogComponent', () => {
  let component: PreprintsHelpDialogComponent;
  let fixture: ComponentFixture<PreprintsHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsHelpDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
