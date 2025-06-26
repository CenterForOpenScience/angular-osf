import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { map, of } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ProjectFilesSelectors } from '@osf/features/project/files/store';
import { CopyButtonComponent, InfoIconComponent } from '@shared/components';

import { environment } from 'src/environments/environment';

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
    InfoIconComponent,
    CopyButtonComponent,
    Skeleton,
  ],
})
export class FileRevisionsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly fileRevisions = select(ProjectFilesSelectors.getFileRevisions);
  readonly isLoading = select(ProjectFilesSelectors.isFileRevisionsLoading);
  readonly fileGuid = toSignal(this.route.params.pipe(map((params) => params['fileGuid'])) ?? of(undefined));

  downloadRevision(version: string): void {
    if (this.fileGuid()) {
      window.open(`${environment.downloadUrl}/${this.fileGuid()}/?revision=${version}`)?.focus();
    }
  }
}
