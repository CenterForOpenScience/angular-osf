import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsHelpDialogComponent } from './collections-help-dialog.component';

describe('CollectionsHelpDialogComponent', () => {
  let component: CollectionsHelpDialogComponent;
  let fixture: ComponentFixture<CollectionsHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsHelpDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
