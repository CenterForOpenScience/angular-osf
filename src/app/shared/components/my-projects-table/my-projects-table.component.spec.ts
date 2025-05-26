import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { TableParameters } from '@osf/shared/models/table-parameters.model';

import { MyProjectsTableComponent } from './my-projects-table.component';

describe('MyProjectsTableComponent', () => {
  let component: MyProjectsTableComponent;
  let fixture: ComponentFixture<MyProjectsTableComponent>;

  const mockTableParams = {
    rows: 10,
    paginator: true,
    scrollable: true,
    rowsPerPageOptions: [5, 10, 20],
    totalRecords: 100,
    firstRowIndex: 0,
    defaultSortOrder: SortOrder.Asc,
    defaultSortColumn: 'name',
  } as TableParameters;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProjectsTableComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tableParams', mockTableParams);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
