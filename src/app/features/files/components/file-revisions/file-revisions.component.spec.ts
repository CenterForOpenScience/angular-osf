import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRevisionsComponent } from './file-revisions.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileRevisionsComponent', () => {
  let component: FileRevisionsComponent;
  let fixture: ComponentFixture<FileRevisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileRevisionsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
