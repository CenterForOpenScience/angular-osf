import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '@shared/components';
import { CustomDialogService } from '@shared/services';

import { ModeratorModel } from '../../models';

import { ModeratorsTableComponent } from './moderators-table.component';

import { MOCK_MODERATORS } from '@testing/mocks/moderator.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

describe.skip('ModeratorsTableComponent', () => {
  let component: ModeratorsTableComponent;
  let fixture: ComponentFixture<ModeratorsTableComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockModerators: ModeratorModel[] = MOCK_MODERATORS;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [ModeratorsTableComponent, OSFTestingModule, MockComponent(SelectComponent)],
      providers: [MockProvider(CustomDialogService, mockCustomDialogService)],
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

    fixture.detectChanges();

    expect(component.items()).toEqual([]);
  });

  it('should handle undefined currentUserId', () => {
    fixture.componentRef.setInput('currentUserId', undefined);

    fixture.detectChanges();

    expect(component.currentUserId()).toBeUndefined();
  });
});
