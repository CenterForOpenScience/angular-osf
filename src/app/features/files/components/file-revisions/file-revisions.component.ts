import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { map, of } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CopyButtonComponent } from '@osf/shared/components';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { DataciteService } from '@shared/services/datacite/datacite.service';

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
  ],
})
export class FileRevisionsComponent {
  private readonly dataciteService = inject(DataciteService);
  private readonly route = inject(ActivatedRoute);
  private readonly environment = inject(ENVIRONMENT);
  private readonly webUrl = this.environment.webUrl;

  readonly fileRevisions = select(FilesSelectors.getFileRevisions);
  readonly isLoading = select(FilesSelectors.isFileRevisionsLoading);
  readonly resourceMetadata = toObservable(select(FilesSelectors.getResourceMetadata));
  readonly fileGuid = toSignal(this.route.params.pipe(map((params) => params['fileGuid'])) ?? of(undefined));

  downloadRevision(version: string): void {
    this.dataciteService.logIdentifiableDownload(this.resourceMetadata).subscribe();
    if (this.fileGuid()) {
      window.open(`${this.webUrl}/download/${this.fileGuid()}/?revision=${version}`)?.focus();
    }
  }
}
