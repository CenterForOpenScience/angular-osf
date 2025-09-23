import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '@shared/components';

import { ModeratorPermission } from '../../enums';
import { ModeratorModel } from '../../models';

import { ModeratorsTableComponent } from './moderators-table.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ModeratorsTableComponent', () => {
  let component: ModeratorsTableComponent;
  let fixture: ComponentFixture<ModeratorsTableComponent>;

  const mockModerators: ModeratorModel[] = [
    {
      id: '1',
      userId: 'user-1',
      fullName: 'John Doe',
      email: 'john@example.com',
      permission: ModeratorPermission.Admin,
      isActive: true,
      education: [],
      employment: [],
    },
    {
      id: '2',
      userId: 'user-2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      permission: ModeratorPermission.Read,
      isActive: true,
      education: [],
      employment: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorsTableComponent, OSFTestingModule, MockComponent(SelectComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorsTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle input values correctly', () => {
    fixture.componentRef.setInput('items', mockModerators);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('currentUserId', 'current-user-123');
    fixture.componentRef.setInput('isCurrentUserAdminModerator', true);

    fixture.detectChanges();

    expect(component.items()).toEqual(mockModerators);
    expect(component.isLoading()).toBe(true);
    expect(component.currentUserId()).toBe('current-user-123');
    expect(component.isCurrentUserAdminModerator()).toBe(true);
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

  it('should have dialog service injected', () => {
    expect(component.dialogService).toBeDefined();
  });

  it('should have translate service injected', () => {
    expect(component.translateService).toBeDefined();
  });

  it('should open education history dialog', () => {
    const moderator = mockModerators[0];
    jest.spyOn(component.dialogService, 'open');

    component.openEducationHistory(moderator);

    expect(component.dialogService.open).toHaveBeenCalled();
  });

  it('should open employment history dialog', () => {
    const moderator = mockModerators[0];
    jest.spyOn(component.dialogService, 'open');

    component.openEmploymentHistory(moderator);

    expect(component.dialogService.open).toHaveBeenCalled();
  });

  it('should handle empty items array', () => {
    fixture.componentRef.setInput('items', []);

    fixture.detectChanges();

    expect(component.items()).toEqual([]);
  });

  it('should handle undefined currentUserId', () => {
    fixture.componentRef.setInput('currentUserId', undefined);

    fixture.detectChanges();

    expect(component.currentUserId()).toBeUndefined();
  });
});
