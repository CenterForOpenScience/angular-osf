import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LinkTableModel } from '@osf/features/project/settings';

@Component({
  selector: 'osf-view-only-table',
  imports: [TableModule, TranslatePipe, DatePipe, InputText, ReactiveFormsModule, Button],
  templateUrl: './view-only-table.component.html',
  styleUrl: './view-only-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewOnlyTableComponent {
  tableData = input.required<LinkTableModel[]>();

  readonly #clipboard = inject(Clipboard);
  copy(link: string): void {
    this.#clipboard.copy(link);
  }
}
