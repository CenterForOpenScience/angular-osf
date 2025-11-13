import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LicenseModel } from '@osf/shared/models/license/license.model';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';

@Component({
  selector: 'osf-license-display',
  imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent, InterpolatePipe],
  templateUrl: './license-display.component.html',
  styleUrl: './license-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDisplayComponent {
  license = input.required<LicenseModel | undefined | null>();
  licenseOptions = input<Record<string, string>>({});
}
