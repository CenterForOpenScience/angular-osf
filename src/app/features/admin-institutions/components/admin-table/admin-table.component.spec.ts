import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { DatePipe } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellData, TableColumn } from '@osf/features/admin-institutions/models';
import { CustomPaginatorComponent } from '@shared/components';

import { AdminTableComponent } from './admin-table.component';

describe('AdminTableComponent', () => {
  let component: AdminTableComponent;
  let componentRef: ComponentRef<AdminTableComponent>;
  let fixture: ComponentFixture<AdminTableComponent>;
  const mockColumns: TableColumn[] = [];
  const mockData: TableCellData[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminTableComponent,
        MockComponent(CustomPaginatorComponent),
        MockPipe(TranslatePipe),
        MockPipe(DatePipe),
      ],
      providers: [MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('tableColumns', mockColumns);
    componentRef.setInput('tableData', mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
