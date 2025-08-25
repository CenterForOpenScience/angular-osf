import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMetadataComponent } from './file-metadata.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('FileMetadataComponent', () => {
  let component: FileMetadataComponent;
  let fixture: ComponentFixture<FileMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMetadataComponent, OSFTestingStoreModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
