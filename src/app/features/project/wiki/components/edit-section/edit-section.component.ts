import { LMarkdownEditorModule, MdEditorOption } from 'ngx-markdown-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-edit-section',
  imports: [PanelModule, Button, TranslatePipe, FormsModule, LMarkdownEditorModule],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSectionComponent implements OnInit {
  readonly currentContent = input.required<string>();
  readonly isSaving = input<boolean>(false);
  readonly contentChange = output<string>();
  readonly saveContent = output<string>();
  private htmlContent = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private editorInstance: any;
  content = '';
  initialContent = '';

  public options: MdEditorOption = {
    showPreviewPanel: false,
    customRender: {},
    fontAwesomeVersion: '6',
    markedjsOpt: {
      sanitize: true,
    },
    hideIcons: [''],
  };

  ngOnInit(): void {
    this.content = this.currentContent();
    this.initialContent = this.currentContent();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditorLoaded(editor: any) {
    this.editorInstance = editor;
    editor.setShowPrintMargin(false);
  }

  onPreviewDomChanged(event: HTMLElement) {
    this.htmlContent = event.innerHTML;
    this.contentChange.emit(event.innerHTML);
  }

  save() {
    this.saveContent.emit(this.htmlContent);
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
}
