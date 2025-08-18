import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRevisionsComponent } from './file-revisions.component';

describe('FileRevisionsComponent', () => {
  let component: FileRevisionsComponent;
  let fixture: ComponentFixture<FileRevisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileRevisionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
