import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CopyButtonComponent } from '@osf/shared/components/copy-button/copy-button.component';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';

import { OsfFileRevision } from '../../models';

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
  isLoading = input(false);

  downloadRevision = output<string>();
  openRevision = output<string>();

  onOpenRevision(version: string): void {
    this.openRevision.emit(version);
  }

  onDownloadRevision(version: string): void {
    this.downloadRevision.emit(version);
  }
}
