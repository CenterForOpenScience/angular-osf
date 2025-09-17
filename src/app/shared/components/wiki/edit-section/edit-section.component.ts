import { LMarkdownEditorModule, MdEditorOption } from 'ngx-markdown-editor';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { Panel } from 'primeng/panel';

import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import 'ace-builds/src-noconflict/ext-language_tools';

import { WikiSyntaxHelpDialogComponent } from '../wiki-syntax-help-dialog/wiki-syntax-help-dialog.component';

@Component({
  selector: 'osf-edit-section',
  imports: [Panel, Button, TranslatePipe, FormsModule, LMarkdownEditorModule, Checkbox],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class EditSectionComponent implements OnInit {
  readonly currentContent = input.required<string>();
  readonly versionContent = input.required<string>();
  readonly isSaving = input<boolean>(false);
  readonly contentChange = output<string>();
  readonly saveContent = output<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private editorInstance: any;
  content = '';
  initialContent = '';
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  public options: MdEditorOption = {
    showPreviewPanel: false,
    customRender: {},
    fontAwesomeVersion: '6',
    markedjsOpt: {
      sanitize: true,
    },
    hideIcons: [''],
  };

  autoCompleteEnabled = false;

  constructor() {
    effect(() => {
      const versionContent = this.versionContent();
      if (!this.initialContent) {
        this.content = versionContent;
        this.initialContent = versionContent;
      }
    });
  }

  ngOnInit(): void {
    this.content = this.currentContent();
    this.initialContent = this.currentContent();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditorLoaded(editor: any) {
    this.editorInstance = editor;
    editor.setShowPrintMargin(false);
    const langTools = ace.require('ace/ext/language_tools');
    editor.setOptions({
      enableBasicAutocompletion: this.autoCompleteEnabled,
      enableLiveAutocompletion: this.autoCompleteEnabled,
      enableSnippets: [langTools.snippetCompleter],
    });
  }

  onPreviewDomChanged() {
    this.contentChange.emit(this.editorInstance?.getValue());
  }

  save() {
    this.saveContent.emit(this.editorInstance?.getValue());
  }

  revert() {
    this.content = this.initialContent;
  }

  undo() {
    this.editorInstance?.undo();
  }

  redo() {
    this.editorInstance?.redo();
  }

  doHorizontalRule() {
    this.editorInstance?.insert('\n');
    this.editorInstance?.insert('----------\n');
    this.editorInstance?.insert('\n');
  }

  openSyntaxHelpDialog() {
    this.dialogService.open(WikiSyntaxHelpDialogComponent, {
      header: this.translateService.instant('project.wiki.syntaxHelp.header'),
      modal: true,
    });
  }

  toggleAutocomplete() {
    if (this.editorInstance) {
      this.autoCompleteEnabled = !this.autoCompleteEnabled;
      this.editorInstance.setOptions({
        enableBasicAutocompletion: this.autoCompleteEnabled,
        enableLiveAutocompletion: this.autoCompleteEnabled,
      });
    }
  }
}
