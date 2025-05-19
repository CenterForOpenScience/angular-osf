import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { TableModule, TablePageEvent } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostBinding, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MEETING_SUBMISSIONS_TABLE_PARAMS } from '@osf/features/meetings/constants/meeting-submissions-table.constants';
import { Meeting, MeetingSubmission } from '@osf/features/meetings/models/meetings.models';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { TableParameters } from '@shared/entities/table-parameters.interface';

import moment from 'moment';

@Component({
  selector: 'osf-meeting-details',
  imports: [SubHeaderComponent, SearchInputComponent, DatePipe, TableModule, Button, RouterLink, TranslatePipe],
  templateUrl: './meeting-details.component.html',
  styleUrl: './meeting-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingDetailsComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  searchValue = signal('');
  sortColumn = signal<string | undefined>(undefined);
  tableParams = signal<TableParameters>({
    ...MEETING_SUBMISSIONS_TABLE_PARAMS,
    firstRowIndex: 0,
  });
  meeting = signal<Meeting>({
    id: '123',
    title: 'title',
    submissionsCount: 1,
    location: 'asd',
    startDate: new Date(),
    endDate: new Date(),
  });
  meetingSubmissions = signal<MeetingSubmission[]>([
    {
      id: '123',
      title: 'SPSP Poster',
      dateCreated: new Date('2018-06-03T21:36:05.241346Z'),
      authorName: 'Moshontz',
      downloadCount: 93,
      meetingCategory: 'poster',
      downloadLink: 'https://osf.io/download/72wkh/',
    },
    {
      id: '123',
      title: 'SPSP Poster',
      dateCreated: new Date('2018-06-03T21:36:05.241346Z'),
      authorName: 'Moshontz',
      downloadCount: 93,
      meetingCategory: 'poster',
      downloadLink: 'https://osf.io/download/72wkh/',
    },
    {
      id: '123',
      title: 'SPSP Poster',
      dateCreated: new Date('2018-06-03T21:36:05.241346Z'),
      authorName: 'Moshontz',
      downloadCount: 93,
      meetingCategory: 'poster',
      downloadLink: 'https://osf.io/download/72wkh/',
    },
  ]);

  pageDescription = computed(() => {
    if (!this.meeting) {
      return '';
    }

    return `${this.meeting().location} | ${moment(this.meeting().startDate).format('MMM D, YYYY')}
    - ${moment(this.meeting().endDate).format('MMM D, YYYY')}`;
  });

  onPageChange(tablePageEvent: TablePageEvent) {
    //TODO romchik
  }

  onSort(sortEvent: SortEvent) {
    //TODO romchik
  }

  downloadSubmission(event: Event, item: MeetingSubmission) {
    event.stopPropagation();
    window.open(item.downloadLink, '_blank');
  }
}
