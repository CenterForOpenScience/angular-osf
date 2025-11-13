import { TranslatePipe } from '@ngx-translate/core';

import { AccordionModule } from 'primeng/accordion';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Employment } from '@osf/shared/models/user/employment.model';
import { MonthYearPipe } from '@osf/shared/pipes/month-year.pipe';

@Component({
  selector: 'osf-employment-history',
  imports: [TranslatePipe, AccordionModule, MonthYearPipe],
  templateUrl: './employment-history.component.html',
  styleUrl: './employment-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentHistoryComponent {
  employment = input<Employment[]>();
}
