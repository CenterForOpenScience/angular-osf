import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileKeywordsComponent } from './file-keywords.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileKeywordsComponent', () => {
  let component: FileKeywordsComponent;
  let fixture: ComponentFixture<FileKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileKeywordsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
