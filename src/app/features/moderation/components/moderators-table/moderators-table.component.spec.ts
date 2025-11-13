import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { TableParameters } from '@shared/models/table-parameters.model';

import { ModeratorModel } from '../../models';

import { ModeratorsTableComponent } from './moderators-table.component';

import { MOCK_MODERATORS } from '@testing/mocks/moderator.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

describe('ModeratorsTableComponent', () => {
  let component: ModeratorsTableComponent;
  let fixture: ComponentFixture<ModeratorsTableComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockModerators: ModeratorModel[] = MOCK_MODERATORS;
  const mockTableParams: TableParameters = {
    rows: 10,
    paginator: true,
    scrollable: false,
    rowsPerPageOptions: [10, 25, 50],
    totalRecords: 0,
    firstRowIndex: 0,
    defaultSortOrder: null,
    defaultSortColumn: null,
  };

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [ModeratorsTableComponent, OSFTestingModule, MockComponent(SelectComponent)],
      providers: [MockProvider(CustomDialogService, mockCustomDialogService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorsTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tableParams', mockTableParams);
    fixture.componentRef.setInput('currentUserId', 'test-user-id');
    fixture.componentRef.setInput('hasAdminAccess', false);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle input values correctly', () => {
    fixture.componentRef.setInput('items', mockModerators);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('currentUserId', 'current-user-123');
    fixture.componentRef.setInput('hasAdminAccess', true);
    fixture.componentRef.setInput('tableParams', mockTableParams);

    fixture.detectChanges();

    expect(component.items()).toEqual(mockModerators);
    expect(component.isLoading()).toBe(true);
    expect(component.currentUserId()).toBe('current-user-123');
    expect(component.hasAdminAccess()).toBe(true);
    expect(component.tableParams()).toEqual(mockTableParams);
  });

  it('should emit update event when updatePermission is called', () => {
    jest.spyOn(component.update, 'emit');
    const moderator = mockModerators[0];

    component.updatePermission(moderator);

    expect(component.update.emit).toHaveBeenCalledWith(moderator);
  });

  it('should emit remove event when removeModerator is called', () => {
    jest.spyOn(component.remove, 'emit');
    const moderator = mockModerators[0];

    component.removeModerator(moderator);

    expect(component.remove.emit).toHaveBeenCalledWith(moderator);
  });

  it('should have skeleton data for loading state', () => {
    expect(component.skeletonData).toBeDefined();
    expect(component.skeletonData.length).toBe(3);
    expect(component.skeletonData.every((item) => typeof item === 'object')).toBe(true);
  });

  it('should have custom dialog service injected', () => {
    expect(component.customDialogService).toBeDefined();
  });

  it('should open education history dialog', () => {
    const moderator = mockModerators[0];
    jest.spyOn(component.customDialogService, 'open');

    component.openEducationHistory(moderator);

    expect(component.customDialogService.open).toHaveBeenCalled();
  });

  it('should open employment history dialog', () => {
    const moderator = mockModerators[0];
    jest.spyOn(component.customDialogService, 'open');

    component.openEmploymentHistory(moderator);

    expect(component.customDialogService.open).toHaveBeenCalled();
  });

  it('should handle empty items array', () => {
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('tableParams', mockTableParams);
    fixture.componentRef.setInput('currentUserId', 'test-user-id');
    fixture.componentRef.setInput('hasAdminAccess', false);

    fixture.detectChanges();

    expect(component.items()).toEqual([]);
  });

  it('should handle undefined currentUserId', () => {
    fixture.componentRef.setInput('currentUserId', undefined);
    fixture.componentRef.setInput('tableParams', mockTableParams);
    fixture.componentRef.setInput('hasAdminAccess', false);

    fixture.detectChanges();

    expect(component.currentUserId()).toBeUndefined();
  });
});
