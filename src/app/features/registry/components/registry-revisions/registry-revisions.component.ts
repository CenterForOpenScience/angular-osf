import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, HostBinding, input, output } from '@angular/core';

import { RegistryOverview } from '@osf/features/registry/models';

@Component({
  selector: 'osf-registry-revisions',
  imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent, Button, TranslatePipe],
  templateUrl: './registry-revisions.component.html',
  styleUrl: './registry-revisions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryRevisionsComponent {
  @HostBinding('class') classes = 'flex-1 flex';
  registry = input.required<RegistryOverview | null>();
  selectedRevisionIndex = input.required<number>();
  openRevision = output<number>();

  emitOpenRevision(index: number) {
    this.openRevision.emit(index);
  }
}
