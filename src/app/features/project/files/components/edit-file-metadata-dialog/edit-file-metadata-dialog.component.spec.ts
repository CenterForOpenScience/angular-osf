import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFileMetadataDialogComponent } from './edit-file-metadata-dialog.component';

describe('EditFileMetadataDialogComponent', () => {
  let component: EditFileMetadataDialogComponent;
  let fixture: ComponentFixture<EditFileMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFileMetadataDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFileMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
