import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileResourceMetadataComponent } from './file-resource-metadata.component';

describe('FileResourceMetadataComponent', () => {
  let component: FileResourceMetadataComponent;
  let fixture: ComponentFixture<FileResourceMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileResourceMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileResourceMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
