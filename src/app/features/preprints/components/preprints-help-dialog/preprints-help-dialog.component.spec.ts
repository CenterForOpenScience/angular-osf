import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintsHelpDialogComponent } from './preprints-help-dialog.component';

describe('PreprintsHelpDialogComponent', () => {
  let component: PreprintsHelpDialogComponent;
  let fixture: ComponentFixture<PreprintsHelpDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintsHelpDialogComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(PreprintsHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
