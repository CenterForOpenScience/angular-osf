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

import { CopyButtonComponent } from '@osf/shared/components';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';

import { FilesSelectors } from '../../store';

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
    CopyButtonComponent,
    Skeleton,
    InfoIconComponent,
  ],
})
export class FileRevisionsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly fileRevisions = select(FilesSelectors.getFileRevisions);
  readonly isLoading = select(FilesSelectors.isFileRevisionsLoading);
  readonly fileGuid = toSignal(this.route.params.pipe(map((params) => params['fileGuid'])) ?? of(undefined));

  downloadRevision(version: string): void {
    if (this.fileGuid()) {
      window.open(`${environment.webUrl}/download/${this.fileGuid()}/?revision=${version}`)?.focus();
    }
  }
}
