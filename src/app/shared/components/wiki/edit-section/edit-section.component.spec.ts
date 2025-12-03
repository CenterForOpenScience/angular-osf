import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { MockModule, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { WikiSyntaxHelpDialogComponent } from '../wiki-syntax-help-dialog/wiki-syntax-help-dialog.component';

import { EditSectionComponent } from './edit-section.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

describe('EditSectionComponent', () => {
  let component: EditSectionComponent;
  let fixture: ComponentFixture<EditSectionComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockEditorInstance: any;

  const mockVersionContent = 'Initial version content';
  const mockCurrentContent = 'Current content';
  const mockEditorValue = 'Editor content value';

  beforeEach(async () => {
    mockEditorInstance = {
      setShowPrintMargin: jest.fn(),
      setOptions: jest.fn(),
      getValue: jest.fn().mockReturnValue(mockEditorValue),
      insert: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
    };

    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    await TestBed.configureTestingModule({
      imports: [EditSectionComponent, OSFTestingModule, MockModule(LMarkdownEditorModule)],
      providers: [MockProvider(CustomDialogService, mockCustomDialogService)],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();
  });

  it('should initialize with default values', () => {
    expect(component.autoCompleteEnabled).toBe(false);
    expect(component.options.showPreviewPanel).toBe(false);
    expect(component.options.fontAwesomeVersion).toBe('6');
  });

  it('should update content when currentContent input changes', () => {
    const newContent = 'New current content';
    fixture.componentRef.setInput('currentContent', newContent);
    fixture.detectChanges();

    expect(component.content).toBe(newContent);
    expect(component.initialContent).toBe(newContent);
  });

  it('should set versionContent only once when initialContent is empty', () => {
    const newFixture = TestBed.createComponent(EditSectionComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('versionContent', mockVersionContent);
    newFixture.componentRef.setInput('currentContent', mockVersionContent);
    newFixture.detectChanges();

    expect(newComponent.content).toBe(mockVersionContent);
    expect(newComponent.initialContent).toBe(mockVersionContent);

    const updatedVersionContent = 'Updated version content';
    newFixture.componentRef.setInput('versionContent', updatedVersionContent);
    newFixture.detectChanges();

    expect(newComponent.content).toBe(mockVersionContent);
    expect(newComponent.initialContent).toBe(mockVersionContent);
  });

  it('should set isSaving input', () => {
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();

    expect(component.isSaving()).toBe(true);
  });

  it('should emit contentChange when onPreviewDomChanged is called', () => {
    (component as any).editorInstance = mockEditorInstance;
    const emitSpy = jest.spyOn(component.contentChange, 'emit');

    component.onPreviewDomChanged();

    expect(mockEditorInstance.getValue).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(mockEditorValue);
  });

  it('should not emit contentChange when editorInstance is null', () => {
    (component as any).editorInstance = null;
    const emitSpy = jest.spyOn(component.contentChange, 'emit');

    component.onPreviewDomChanged();

    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('should emit saveContent when save is called', () => {
    (component as any).editorInstance = mockEditorInstance;
    const emitSpy = jest.spyOn(component.saveContent, 'emit');

    component.save();

    expect(mockEditorInstance.getValue).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(mockEditorValue);
  });

  it('should not emit saveContent when editorInstance is null', () => {
    (component as any).editorInstance = null;
    const emitSpy = jest.spyOn(component.saveContent, 'emit');

    component.save();

    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('should revert content to initialContent', () => {
    component.content = 'Modified content';
    component.initialContent = 'Original content';

    component.revert();

    expect(component.content).toBe('Original content');
  });

  it('should call undo on editorInstance', () => {
    (component as any).editorInstance = mockEditorInstance;

    component.undo();

    expect(mockEditorInstance.undo).toHaveBeenCalled();
  });

  it('should not call undo when editorInstance is null', () => {
    (component as any).editorInstance = null;

    expect(() => component.undo()).not.toThrow();
  });

  it('should call redo on editorInstance', () => {
    (component as any).editorInstance = mockEditorInstance;

    component.redo();

    expect(mockEditorInstance.redo).toHaveBeenCalled();
  });

  it('should not call redo when editorInstance is null', () => {
    (component as any).editorInstance = null;

    expect(() => component.redo()).not.toThrow();
  });

  it('should insert horizontal rule markdown', () => {
    (component as any).editorInstance = mockEditorInstance;

    component.doHorizontalRule();

    expect(mockEditorInstance.insert).toHaveBeenCalledTimes(3);
    expect(mockEditorInstance.insert).toHaveBeenNthCalledWith(1, '\n');
    expect(mockEditorInstance.insert).toHaveBeenNthCalledWith(2, '----------\n');
    expect(mockEditorInstance.insert).toHaveBeenNthCalledWith(3, '\n');
  });

  it('should not insert horizontal rule when editorInstance is null', () => {
    (component as any).editorInstance = null;

    expect(() => component.doHorizontalRule()).not.toThrow();
  });

  it('should open syntax help dialog', () => {
    component.openSyntaxHelpDialog();

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(WikiSyntaxHelpDialogComponent, {
      header: 'project.wiki.syntaxHelp.header',
    });
  });

  it('should configure editor when onEditorLoaded is called', () => {
    component.onEditorLoaded(mockEditorInstance);

    expect((component as any).editorInstance).toBe(mockEditorInstance);
    expect(mockEditorInstance.setShowPrintMargin).toHaveBeenCalledWith(false);
    expect((global as any).ace.require).toHaveBeenCalledWith('ace/ext/language_tools');
    expect(mockEditorInstance.setOptions).toHaveBeenCalledWith({
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: [{}],
    });
  });

  it('should toggle autocomplete when editorInstance exists', () => {
    (component as any).editorInstance = mockEditorInstance;
    component.autoCompleteEnabled = false;

    component.toggleAutocomplete();

    expect(component.autoCompleteEnabled).toBe(true);
    expect(mockEditorInstance.setOptions).toHaveBeenCalledWith({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });

    component.toggleAutocomplete();

    expect(component.autoCompleteEnabled).toBe(false);
    expect(mockEditorInstance.setOptions).toHaveBeenCalledWith({
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
    });
  });

  it('should not toggle autocomplete when editorInstance is null', () => {
    (component as any).editorInstance = null;
    component.autoCompleteEnabled = false;

    component.toggleAutocomplete();

    expect(component.autoCompleteEnabled).toBe(false);
  });

  it('should handle empty content values', () => {
    fixture.componentRef.setInput('currentContent', '');
    fixture.componentRef.setInput('versionContent', '');
    fixture.detectChanges();

    expect(component.content).toBe('');
    expect(component.initialContent).toBe('');
  });
});
