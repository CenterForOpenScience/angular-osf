import { TranslatePipe } from '@ngx-translate/core';

import { AccordionModule } from 'primeng/accordion';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Education } from '@osf/shared/models';
import { MonthYearPipe } from '@osf/shared/pipes';

@Component({
  selector: 'osf-education-history',
  imports: [TranslatePipe, AccordionModule, MonthYearPipe],
  templateUrl: './education-history.component.html',
  styleUrl: './education-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationHistoryComponent {
  education = input<Education[]>();
}
