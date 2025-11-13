import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { EditSectionComponent } from './edit-section.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { DialogServiceMockBuilder } from '@testing/providers/dialog-provider.mock';

describe('EditSectionComponent', () => {
  let component: EditSectionComponent;
  let fixture: ComponentFixture<EditSectionComponent>;
  let mockCustomDialogService: ReturnType<DialogServiceMockBuilder['build']>;

  const mockCurrentContent = '# Test Content\nThis is test content';
  const mockVersionContent = '# Version Content\nThis is version content';

  beforeEach(async () => {
    mockCustomDialogService = DialogServiceMockBuilder.create().withOpenMock().build();

    await TestBed.configureTestingModule({
      imports: [EditSectionComponent, OSFTestingModule],
      providers: [MockProvider(CustomDialogService, mockCustomDialogService)],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have required inputs', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(component.currentContent()).toBe(mockCurrentContent);
    expect(component.versionContent()).toBe(mockVersionContent);
  });

  it('should have isSaving input with default value false', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(component.isSaving()).toBe(false);
  });

  it('should initialize content from currentContent on ngOnInit', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(component.content).toBe(mockCurrentContent);
    expect(component.initialContent).toBe(mockCurrentContent);
  });

  it('should have default editor options', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(component.options.showPreviewPanel).toBe(false);
    expect(component.options.fontAwesomeVersion).toBe('6');
    expect(component.options.markedjsOpt?.sanitize).toBe(true);
  });

  it('should have autoCompleteEnabled set to false by default', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(component.autoCompleteEnabled).toBe(false);
  });

  it('should store editor instance and configure it', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    const mockEditor = {
      setShowPrintMargin: jest.fn(),
      setOptions: jest.fn(),
    };

    component.onEditorLoaded(mockEditor);

    expect(mockEditor.setShowPrintMargin).toHaveBeenCalledWith(false);
    expect(mockEditor.setOptions).toHaveBeenCalled();
  });

  it('should emit contentChange with editor value', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    const mockEditor = {
      getValue: jest.fn().mockReturnValue('Updated content'),
      setShowPrintMargin: jest.fn(),
      setOptions: jest.fn(),
    };

    component.onEditorLoaded(mockEditor);

    const emitSpy = jest.spyOn(component.contentChange, 'emit');

    component.onPreviewDomChanged();

    expect(mockEditor.getValue).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('Updated content');
  });

  it('should handle when editor is not loaded', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.contentChange, 'emit');

    expect(() => component.onPreviewDomChanged()).not.toThrow();
    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('should emit saveContent with editor value', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    const mockEditor = {
      getValue: jest.fn().mockReturnValue('Content to save'),
      setShowPrintMargin: jest.fn(),
      setOptions: jest.fn(),
    };

    component.onEditorLoaded(mockEditor);

    const emitSpy = jest.spyOn(component.saveContent, 'emit');

    component.save();

    expect(mockEditor.getValue).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('Content to save');
  });

  it('should handle when editor is not loaded', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.saveContent, 'emit');

    expect(() => component.save()).not.toThrow();
    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('should revert content to initialContent', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    component.content = 'Modified content';

    component.revert();

    expect(component.content).toBe(mockCurrentContent);
  });

  it('should call editor undo method', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    const mockEditor = {
      undo: jest.fn(),
      setShowPrintMargin: jest.fn(),
      setOptions: jest.fn(),
    };

    component.onEditorLoaded(mockEditor);
    component.undo();

    expect(mockEditor.undo).toHaveBeenCalled();
  });

  it('should not throw when editor is not loaded', () => {
    fixture.componentRef.setInput('currentContent', mockCurrentContent);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.detectChanges();

    expect(() => component.undo()).not.toThrow();
  });

  describe('redo', () => {
    it('should call editor redo method', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      const mockEditor = {
        redo: jest.fn(),
        setShowPrintMargin: jest.fn(),
        setOptions: jest.fn(),
      };

      component.onEditorLoaded(mockEditor);
      component.redo();

      expect(mockEditor.redo).toHaveBeenCalled();
    });

    it('should not throw when editor is not loaded', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      expect(() => component.redo()).not.toThrow();
    });
  });

  describe('doHorizontalRule', () => {
    it('should insert horizontal rule into editor', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      const mockEditor = {
        insert: jest.fn(),
        setShowPrintMargin: jest.fn(),
        setOptions: jest.fn(),
      };

      component.onEditorLoaded(mockEditor);
      component.doHorizontalRule();

      expect(mockEditor.insert).toHaveBeenCalledTimes(3);
      expect(mockEditor.insert).toHaveBeenCalledWith('\n');
      expect(mockEditor.insert).toHaveBeenCalledWith('----------\n');
    });

    it('should not throw when editor is not loaded', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      expect(() => component.doHorizontalRule()).not.toThrow();
    });
  });

  describe('openSyntaxHelpDialog', () => {
    it('should open syntax help dialog', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      component.openSyntaxHelpDialog();

      expect(mockCustomDialogService.open).toHaveBeenCalled();
    });
  });

  describe('toggleAutocomplete', () => {
    it('should toggle autocomplete on', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      const mockEditor = {
        setOptions: jest.fn(),
        setShowPrintMargin: jest.fn(),
      };

      component.onEditorLoaded(mockEditor);
      expect(component.autoCompleteEnabled).toBe(false);

      component.toggleAutocomplete();

      expect(component.autoCompleteEnabled).toBe(true);
      expect(mockEditor.setOptions).toHaveBeenCalledWith({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      });
    });

    it('should toggle autocomplete off', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      const mockEditor = {
        setOptions: jest.fn(),
        setShowPrintMargin: jest.fn(),
      };

      component.onEditorLoaded(mockEditor);
      component.autoCompleteEnabled = true;

      component.toggleAutocomplete();

      expect(component.autoCompleteEnabled).toBe(false);
      expect(mockEditor.setOptions).toHaveBeenCalledWith({
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
      });
    });

    it('should not throw when editor is not loaded', () => {
      fixture.componentRef.setInput('currentContent', mockCurrentContent);
      fixture.componentRef.setInput('versionContent', mockVersionContent);
      fixture.detectChanges();

      expect(() => component.toggleAutocomplete()).not.toThrow();
    });
  });
});
