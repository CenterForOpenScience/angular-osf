import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule, TablePageEvent } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { MEETINGS_TABLE_PARAMS } from '@osf/features/meetings/constants/meetings-table.constants';
import { Meeting } from '@osf/features/meetings/models/meetings.models';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { TableParameters } from '@shared/entities/table-parameters.interface';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-meetings-landing',
  imports: [SubHeaderComponent, Card, SearchInputComponent, Button, DatePipe, TableModule, TranslatePipe],
  templateUrl: './meetings-landing.component.html',
  styleUrl: './meetings-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsLandingComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  readonly isXSmall = toSignal(inject(IS_XSMALL));
  #router = inject(Router);

  searchValue = signal('');
  sortColumn = signal<string | undefined>(undefined);
  tableParams = signal<TableParameters>({
    ...MEETINGS_TABLE_PARAMS,
    firstRowIndex: 0,
  });
  meetings = signal<Meeting[]>([
    {
      id: '123',
      title: 'title',
      submissionsCount: 1,
      location: 'asd',
      startDate: new Date(),
      endDate: new Date(),
    },
    {
      id: '123',
      title: 'title',
      submissionsCount: 1,
      location: 'asd',
      startDate: new Date(),
      endDate: new Date(),
    },
    {
      id: '123',
      title: 'title',
      submissionsCount: 1,
      location: 'asd',
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);

  onPageChange(tablePageEvent: TablePageEvent) {
    //TODO romchik
  }

  onSort(sortEvent: SortEvent) {
    //TODO romchik
  }

  navigateToMeeting(meeting: Meeting): void {
    this.#router.navigate(['/meetings', meeting.id]);
  }
}
