import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PaginatedViewOnlyLinksModel, ViewOnlyLinkModel } from '@osf/features/project/settings/models';

import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'osf-view-only-table',
  imports: [
    TableModule,
    TranslatePipe,
    DatePipe,
    InputText,
    ReactiveFormsModule,
    Button,
    CopyButtonComponent,
    Skeleton,
  ],
  templateUrl: './view-only-table.component.html',
  styleUrl: './view-only-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewOnlyTableComponent {
  tableData = input.required<PaginatedViewOnlyLinksModel>();
  isLoading = input(true);

  deleteLink = output<ViewOnlyLinkModel>();

  skeletonData: ViewOnlyLinkModel[] = Array.from({ length: 3 }, () => ({}) as ViewOnlyLinkModel);
}
