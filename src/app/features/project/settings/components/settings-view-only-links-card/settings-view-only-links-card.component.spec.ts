import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyTableComponent } from '@osf/shared/components/view-only-table/view-only-table.component';
import { PaginatedViewOnlyLinksModel } from '@shared/models/view-only-links/view-only-link.model';

import { SettingsViewOnlyLinksCardComponent } from './settings-view-only-links-card.component';

import { MOCK_PAGINATED_VIEW_ONLY_LINKS, MOCK_VIEW_ONLY_LINK } from '@testing/mocks/view-only-link.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SettingsViewOnlyLinksCardComponent', () => {
  let component: SettingsViewOnlyLinksCardComponent;
  let fixture: ComponentFixture<SettingsViewOnlyLinksCardComponent>;

  const mockViewOnlyLink = MOCK_VIEW_ONLY_LINK;
  const mockTableData = MOCK_PAGINATED_VIEW_ONLY_LINKS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsViewOnlyLinksCardComponent, OSFTestingModule, MockComponent(ViewOnlyTableComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsViewOnlyLinksCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('tableData', mockTableData);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with tableData input', () => {
    fixture.componentRef.setInput('tableData', mockTableData);
    fixture.detectChanges();

    expect(component.tableData()).toEqual(mockTableData);
  });

  it('should handle isLoading input when set to true', () => {
    fixture.componentRef.setInput('tableData', mockTableData);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should emit deleteTableItem when deleteLink event is triggered', () => {
    jest.spyOn(component.deleteTableItem, 'emit');
    fixture.componentRef.setInput('tableData', mockTableData);
    fixture.detectChanges();

    component.deleteTableItem.emit(mockViewOnlyLink);

    expect(component.deleteTableItem.emit).toHaveBeenCalledWith(mockViewOnlyLink);
  });

  it('should handle empty table data', () => {
    const emptyTableData: PaginatedViewOnlyLinksModel = {
      items: [],
      total: 0,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('tableData', emptyTableData);
    fixture.detectChanges();

    expect(component.tableData()).toEqual(emptyTableData);
  });

  it('should handle multiple view only links', () => {
    const multipleLinksData: PaginatedViewOnlyLinksModel = {
      items: [
        mockViewOnlyLink,
        {
          ...mockViewOnlyLink,
          id: 'test-link-2',
          name: 'Second View Only Link',
          key: 'def456',
        },
      ],
      total: 2,
      perPage: 10,
      next: null,
      prev: null,
    };

    fixture.componentRef.setInput('tableData', multipleLinksData);
    fixture.detectChanges();

    expect(component.tableData().items.length).toBe(2);
    expect(component.tableData().total).toBe(2);
  });
});
