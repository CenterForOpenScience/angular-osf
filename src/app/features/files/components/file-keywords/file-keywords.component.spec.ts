import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileKeywordsComponent } from './file-keywords.component';

describe('FileKeywordsComponent', () => {
  let component: FileKeywordsComponent;
  let fixture: ComponentFixture<FileKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileKeywordsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
