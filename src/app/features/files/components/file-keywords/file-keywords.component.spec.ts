import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { FilesSelectors } from '../../store';

import { FileKeywordsComponent } from './file-keywords.component';

describe('FileKeywordsComponent', () => {
  let component: FileKeywordsComponent;
  let fixture: ComponentFixture<FileKeywordsComponent>;

  const mockFile = {
    guid: 'test-guid',
    name: 'test-file.txt',
  };

  const mockTags = ['tag1', 'tag2', 'tag3'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileKeywordsComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getFileTags, value: signal(mockTags) },
            { selector: FilesSelectors.isFileTagsLoading, value: signal(false) },
            { selector: FilesSelectors.getOpenedFile, value: signal(mockFile) },
            { selector: FilesSelectors.hasWriteAccess, value: signal(true) },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(FileKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.tags).toBeDefined();
    expect(component.isTagsLoading).toBeDefined();
    expect(component.file).toBeDefined();
    expect(component.hasWriteAccess).toBeDefined();
    expect(component.keywordControl).toBeDefined();
  });

  it('should initialize keyword control with empty value', () => {
    expect(component.keywordControl.value).toBe('');
  });

  it('should validate keyword control', () => {
    component.keywordControl.setValue('valid-keyword');
    expect(component.keywordControl.valid).toBe(true);
  });

  it('should be invalid when keyword is empty', () => {
    component.keywordControl.setValue('');
    expect(component.keywordControl.invalid).toBe(true);
  });

  it('should be invalid when keyword is only whitespace', () => {
    component.keywordControl.setValue('   ');
    expect(component.keywordControl.invalid).toBe(true);
  });

  it('should not add tag when keyword is empty', () => {
    component.keywordControl.setValue('');

    expect(() => component.addTag()).not.toThrow();
  });

  it('should delete tag when deleteTag is called', () => {
    expect(() => component.deleteTag('tag1')).not.toThrow();
  });

  it('should compute hasViewOnly based on router', () => {
    expect(component.hasViewOnly).toBeDefined();
    expect(typeof component.hasViewOnly()).toBe('boolean');
  });
});
