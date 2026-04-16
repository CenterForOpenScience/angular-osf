import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { CollectionsHelpDialogComponent } from './collections-help-dialog.component';

describe('CollectionsHelpDialogComponent', () => {
  let component: CollectionsHelpDialogComponent;
  let fixture: ComponentFixture<CollectionsHelpDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CollectionsHelpDialogComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(CollectionsHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
