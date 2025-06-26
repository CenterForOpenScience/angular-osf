import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileProjectMetadataComponent } from './file-project-metadata.component';

describe('FileProjectMetadataComponent', () => {
  let component: FileProjectMetadataComponent;
  let fixture: ComponentFixture<FileProjectMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileProjectMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileProjectMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
