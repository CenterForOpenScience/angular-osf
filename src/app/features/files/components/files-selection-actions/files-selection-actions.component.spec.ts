import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSelectionActionsComponent } from './files-selection-actions.component';

describe.skip('FilesSelectionActionsComponent', () => {
  let component: FilesSelectionActionsComponent;
  let fixture: ComponentFixture<FilesSelectionActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesSelectionActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesSelectionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
