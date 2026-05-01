import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { TableParameters } from '@shared/models/table-parameters.model';
import { CustomDialogService } from '@shared/services/custom-dialog.service';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY } from '@testing/mocks/contributors.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

import { EducationHistoryDialogComponent } from '../../education-history-dialog/education-history-dialog.component';
import { EmploymentHistoryDialogComponent } from '../../employment-history-dialog/employment-history-dialog.component';
import { IconComponent } from '../../icon/icon.component';
import { InfoIconComponent } from '../../info-icon/info-icon.component';
import { SelectComponent } from '../../select/select.component';

import { ContributorsTableComponent } from './contributors-table.component';

const makeTableParams = (overrides: Partial<TableParameters> = {}): TableParameters => ({
  rows: 10,
  paginator: true,
  scrollable: false,
  rowsPerPageOptions: [10, 25, 50],
  totalRecords: 4,
  firstRowIndex: 10,
  defaultSortOrder: null,
  defaultSortColumn: null,
  ...overrides,
});

describe('ContributorsTableComponent', () => {
  let component: ContributorsTableComponent;
  let fixture: ComponentFixture<ContributorsTableComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(() => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [ContributorsTableComponent, ...MockComponents(SelectComponent, IconComponent, InfoIconComponent)],
      providers: [provideOSFCore(), MockProvider(CustomDialogService, mockCustomDialogService)],
    });

    fixture = TestBed.createComponent(ContributorsTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tableParams', makeTableParams());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true from isProject when resourceType is Project', () => {
    fixture.componentRef.setInput('resourceType', ResourceType.Project);
    fixture.detectChanges();
    expect(component.isProject()).toBe(true);
  });

  it('should return false from isProject when resourceType is Registration', () => {
    fixture.componentRef.setInput('resourceType', ResourceType.Registration);
    fixture.detectChanges();
    expect(component.isProject()).toBe(false);
  });

  it('should return true from deactivatedContributors when at least one contributor is deactivated', () => {
    fixture.componentRef.setInput('contributors', [
      { ...MOCK_CONTRIBUTOR, id: '1', deactivated: false },
      { ...MOCK_CONTRIBUTOR_WITHOUT_HISTORY, id: '2', deactivated: true },
    ]);
    fixture.detectChanges();
    expect(component.deactivatedContributors()).toBe(true);
  });

  it('should return false from deactivatedContributors when all contributors are active', () => {
    fixture.componentRef.setInput('contributors', [
      { ...MOCK_CONTRIBUTOR, id: '1', deactivated: false },
      { ...MOCK_CONTRIBUTOR_WITHOUT_HISTORY, id: '2', deactivated: false },
    ]);
    fixture.detectChanges();
    expect(component.deactivatedContributors()).toBe(false);
  });

  it('should return false from deactivatedContributors when contributor list is empty', () => {
    fixture.componentRef.setInput('contributors', []);
    fixture.detectChanges();
    expect(component.deactivatedContributors()).toBe(false);
  });

  it('should default showLoadMore to false', () => {
    expect(component.showLoadMore()).toBe(false);
  });

  it('should reflect showLoadMore as true when set by parent', () => {
    fixture.componentRef.setInput('showLoadMore', true);
    fixture.detectChanges();
    expect(component.showLoadMore()).toBe(true);
  });

  it('should emit remove event with the given contributor when removeContributor is called', () => {
    const contributor: ContributorModel = { ...MOCK_CONTRIBUTOR, id: 'remove-id' };
    vi.spyOn(component.remove, 'emit');

    component.removeContributor(contributor);

    expect(component.remove.emit).toHaveBeenCalledWith(contributor);
  });

  it('should emit loadMore event when loadMoreItems is called', () => {
    vi.spyOn(component.loadMore, 'emit');

    component.loadMoreItems();

    expect(component.loadMore.emit).toHaveBeenCalled();
  });

  it('should open EducationHistoryDialogComponent with contributor education data', () => {
    const contributor: ContributorModel = {
      ...MOCK_CONTRIBUTOR,
      id: 'education-id',
      education: [
        {
          institution: 'University',
          department: 'Physics',
          degree: 'MSc',
          startMonth: 9,
          startYear: 2018,
          endMonth: 6,
          endYear: 2020,
          ongoing: false,
        },
      ],
    };

    component.openEducationHistory(contributor);

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(EducationHistoryDialogComponent, {
      header: 'project.contributors.table.headers.education',
      width: '552px',
      data: contributor.education,
    });
  });

  it('should open EducationHistoryDialogComponent with an empty education array', () => {
    const contributor: ContributorModel = { ...MOCK_CONTRIBUTOR, id: 'no-education-id', education: [] };

    component.openEducationHistory(contributor);

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(EducationHistoryDialogComponent, {
      header: 'project.contributors.table.headers.education',
      width: '552px',
      data: [],
    });
  });

  it('should open EmploymentHistoryDialogComponent with contributor employment data', () => {
    const contributor: ContributorModel = {
      ...MOCK_CONTRIBUTOR,
      id: 'employment-id',
      employment: [
        {
          institution: 'Company',
          department: 'Engineering',
          title: 'Developer',
          startMonth: 1,
          startYear: 2021,
          endMonth: null,
          endYear: null,
          ongoing: true,
        },
      ],
    };

    component.openEmploymentHistory(contributor);

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(EmploymentHistoryDialogComponent, {
      header: 'project.contributors.table.headers.employment',
      width: '552px',
      data: contributor.employment,
    });
  });

  it('should open EmploymentHistoryDialogComponent with an empty employment array', () => {
    const contributor: ContributorModel = { ...MOCK_CONTRIBUTOR, id: 'no-employment-id', employment: [] };

    component.openEmploymentHistory(contributor);

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(EmploymentHistoryDialogComponent, {
      header: 'project.contributors.table.headers.employment',
      width: '552px',
      data: [],
    });
  });

  it('should reindex contributors starting from tableParams.firstRowIndex on row reorder', () => {
    fixture.componentRef.setInput('tableParams', makeTableParams({ firstRowIndex: 10 }));
    fixture.componentRef.setInput('contributors', [
      { ...MOCK_CONTRIBUTOR, id: '1', index: 0 },
      { ...MOCK_CONTRIBUTOR_WITHOUT_HISTORY, id: '2', index: 1 },
      { ...MOCK_CONTRIBUTOR, id: '3', index: 2 },
    ]);
    fixture.detectChanges();

    component.onRowReorder();

    expect(component.contributors().map((c) => c.index)).toEqual([10, 11, 12]);
  });

  it('should reindex contributors from 0 when firstRowIndex is 0 on row reorder', () => {
    fixture.componentRef.setInput('tableParams', makeTableParams({ firstRowIndex: 0 }));
    fixture.componentRef.setInput('contributors', [
      { ...MOCK_CONTRIBUTOR, id: '1', index: 5 },
      { ...MOCK_CONTRIBUTOR_WITHOUT_HISTORY, id: '2', index: 6 },
    ]);
    fixture.detectChanges();

    component.onRowReorder();

    expect(component.contributors().map((c) => c.index)).toEqual([0, 1]);
  });
});
