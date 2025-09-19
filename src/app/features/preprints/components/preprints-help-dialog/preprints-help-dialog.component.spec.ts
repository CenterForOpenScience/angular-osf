import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsHelpDialogComponent } from './preprints-help-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintsHelpDialogComponent', () => {
  let component: PreprintsHelpDialogComponent;
  let fixture: ComponentFixture<PreprintsHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsHelpDialogComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
