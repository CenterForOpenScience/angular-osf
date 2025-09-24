import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { CopyButtonComponent } from '@osf/shared/components';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { StopPropagationDirective } from '@osf/shared/directives';

import { OsfFileRevision } from '../../models';
import { FilesSelectors } from '../../store';

@Component({
  selector: 'osf-file-revisions',
  templateUrl: './file-revisions.component.html',
  styleUrls: ['./file-revisions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Button,
    DatePipe,
    TranslatePipe,
    CopyButtonComponent,
    Skeleton,
    InfoIconComponent,
    StopPropagationDirective,
  ],
})
export class FileRevisionsComponent {
  fileRevisions = input<OsfFileRevision[] | null>();

  downloadRevision = output<string>();
  openRevision = output<string>();

  readonly isLoading = select(FilesSelectors.isFileRevisionsLoading);
  readonly resourceMetadata = toObservable(select(FilesSelectors.getResourceMetadata));

  onOpenRevision(version: string): void {
    this.openRevision.emit(version);
  }

  onDownloadRevision(version: string): void {
    this.downloadRevision.emit(version);
  }
}
