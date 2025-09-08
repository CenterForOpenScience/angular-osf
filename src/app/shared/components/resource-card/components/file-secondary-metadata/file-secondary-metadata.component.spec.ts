import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSecondaryMetadataComponent } from './file-secondary-metadata.component';

describe.skip('FileSecondaryMetadataComponent', () => {
  let component: FileSecondaryMetadataComponent;
  let fixture: ComponentFixture<FileSecondaryMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSecondaryMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileSecondaryMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
