import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';

import { of } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingsSelectors } from '@osf/features/meetings/store';
import { SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { MOCK_MEETING, MOCK_MEETING_SUBMISSIONS, MOCK_STORE } from '@shared/mocks';

import { MeetingDetailsComponent } from './meeting-details.component';

const mockActivatedRoute = {
  params: of({ id: 'test-meeting-id' }),
  queryParams: of({}),
  snapshot: {
    params: { id: 'test-meeting-id' },
    queryParams: {},
  },
};

const mockRouter = {
  navigate: jest.fn(),
  url: '/',
  createUrlTree: jest.fn(),
  navigateByUrl: jest.fn(),
  events: {
    subscribe: jest.fn(),
  },
};

describe('MeetingDetailsComponent', () => {
  let component: MeetingDetailsComponent;
  let fixture: ComponentFixture<MeetingDetailsComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MeetingsSelectors.getAllMeetingSubmissions) return () => MOCK_MEETING_SUBMISSIONS;
      if (selector === MeetingsSelectors.getMeetingSubmissionsTotalCount) return () => MOCK_MEETING_SUBMISSIONS.length;
      if (selector === MeetingsSelectors.isMeetingSubmissionsLoading) return () => false;
      if (selector === MeetingsSelectors.getMeetingById) {
        return () => (id: string) => (id === MOCK_MEETING.id ? MOCK_MEETING : null);
      }
      return () => null;
    });

    (MOCK_STORE.selectSnapshot as jest.Mock).mockImplementation((selector) => {
      if (selector === MeetingsSelectors.getMeetingById) {
        return (id: string) => (id === MOCK_MEETING.id ? MOCK_MEETING : null);
      }
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [
        MeetingDetailsComponent,
        ...MockComponents(SubHeaderComponent, SearchInputComponent),
        MockPipe(TranslatePipe),
        MockPipe(DatePipe),
      ],
      providers: [
        MockProvider(Store, MOCK_STORE),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default table params', () => {
    expect(component.tableParams().rows).toBeDefined();
    expect(component.tableParams().firstRowIndex).toBe(0);
  });

  it('should open download link if present', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation();
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    component.downloadSubmission(event, MOCK_MEETING_SUBMISSIONS[0]);
    expect(openSpy).toHaveBeenCalledWith('https://example.com/file.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('should not open download link if not present', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation();
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    component.downloadSubmission(event, MOCK_MEETING_SUBMISSIONS[1]);
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('should update query params in router on page change', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onPageChange({ first: 10, rows: 10 } as TablePageEvent);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({ page: '2', size: '10' }),
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should update query params in router on sort', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onSort({ field: 'title', order: 1 } as SortEvent);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({ sortColumn: 'title', sortOrder: 'asc' }),
        queryParamsHandling: 'merge',
      })
    );
  });
});
