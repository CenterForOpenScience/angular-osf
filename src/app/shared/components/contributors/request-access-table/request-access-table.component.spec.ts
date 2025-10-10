import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorPermission, ResourceType } from '@osf/shared/enums';
import { MOCK_USER } from '@osf/shared/mocks';
import { RequestAccessModel } from '@osf/shared/models';

import { RequestAccessTableComponent } from './request-access-table.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { DialogServiceMockBuilder } from '@testing/providers/dialog-provider.mock';

describe('RequestAccessTableComponent', () => {
  let component: RequestAccessTableComponent;
  let fixture: ComponentFixture<RequestAccessTableComponent>;
  let mockDialogService: ReturnType<DialogServiceMockBuilder['build']>;

  const mockRequestAccessItem: RequestAccessModel = {
    id: 'request-1',
    requestType: 'contributor',
    machineState: 'pending',
    comment: 'I would like to contribute',
    created: '2024-01-01',
    modified: '2024-01-02',
    dateLastTransitioned: '2024-01-02',
    requestedPermissions: ContributorPermission.Write,
    creator: MOCK_USER,
    isBibliographic: true,
    isCurator: false,
  };

  const mockRequestAccessItem2: RequestAccessModel = {
    id: 'request-2',
    requestType: 'contributor',
    machineState: 'pending',
    comment: 'Please add me as admin',
    created: '2024-01-03',
    modified: '2024-01-03',
    dateLastTransitioned: '2024-01-03',
    requestedPermissions: ContributorPermission.Admin,
    creator: { ...MOCK_USER, id: '2', fullName: 'Jane Smith' },
    isBibliographic: false,
    isCurator: true,
  };

  beforeEach(async () => {
    mockDialogService = DialogServiceMockBuilder.create().withOpenMock().build();

    await TestBed.configureTestingModule({
      imports: [RequestAccessTableComponent, OSFTestingModule],
      providers: [MockProvider(DialogService, mockDialogService)],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('requestAccessList', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.resourceType()).toBe(ResourceType.Project);
    expect(component.showEmployment()).toBe(true);
    expect(component.showEducation()).toBe(true);
    expect(component.showInfo()).toBe(true);
  });

  it('should accept requestAccessList input', () => {
    const requestList = [mockRequestAccessItem];
    fixture.componentRef.setInput('requestAccessList', requestList);
    fixture.detectChanges();

    expect(component.requestAccessList()).toEqual(requestList);
  });

  it('should accept isLoading input', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should accept resourceType input', () => {
    fixture.componentRef.setInput('resourceType', ResourceType.Registration);
    fixture.detectChanges();

    expect(component.resourceType()).toBe(ResourceType.Registration);
  });

  it('should accept showEmployment input', () => {
    fixture.componentRef.setInput('showEmployment', false);
    fixture.detectChanges();

    expect(component.showEmployment()).toBe(false);
  });

  it('should accept showEducation input', () => {
    fixture.componentRef.setInput('showEducation', false);
    fixture.detectChanges();

    expect(component.showEducation()).toBe(false);
  });

  it('should accept showInfo input', () => {
    fixture.componentRef.setInput('showInfo', false);
    fixture.detectChanges();

    expect(component.showInfo()).toBe(false);
  });

  it('should have permissionsOptions defined', () => {
    expect(component.permissionsOptions).toBeDefined();
    expect(Array.isArray(component.permissionsOptions)).toBe(true);
  });

  it('should have skeletonData defined', () => {
    expect(component.skeletonData).toBeDefined();
    expect(Array.isArray(component.skeletonData)).toBe(true);
    expect(component.skeletonData.length).toBe(3);
  });

  it('should compute isProject correctly for Project resource type', () => {
    fixture.componentRef.setInput('resourceType', ResourceType.Project);
    fixture.detectChanges();

    expect(component.isProject()).toBe(true);
  });

  it('should compute isProject correctly for non-Project resource type', () => {
    fixture.componentRef.setInput('resourceType', ResourceType.Registration);
    fixture.detectChanges();

    expect(component.isProject()).toBe(false);
  });

  it('should handle multiple request access items', () => {
    const requestList = [mockRequestAccessItem, mockRequestAccessItem2];
    fixture.componentRef.setInput('requestAccessList', requestList);
    fixture.detectChanges();

    expect(component.requestAccessList()).toEqual(requestList);
    expect(component.requestAccessList().length).toBe(2);
  });

  it('should handle empty request access list', () => {
    fixture.componentRef.setInput('requestAccessList', []);
    fixture.detectChanges();

    expect(component.requestAccessList()).toEqual([]);
  });

  it('should emit accept event when acceptContributor is called', () => {
    const acceptSpy = jest.fn();
    component.accept.subscribe(acceptSpy);

    component.acceptContributor(mockRequestAccessItem);

    expect(acceptSpy).toHaveBeenCalledWith(mockRequestAccessItem);
  });

  it('should emit reject event when rejectContributor is called', () => {
    const rejectSpy = jest.fn();
    component.reject.subscribe(rejectSpy);

    component.rejectContributor(mockRequestAccessItem);

    expect(rejectSpy).toHaveBeenCalledWith(mockRequestAccessItem);
  });

  it('should open education history dialog with correct data', () => {
    component.openEducationHistory(mockRequestAccessItem);

    expect(mockDialogService.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        header: 'project.contributors.table.headers.education',
        width: '552px',
        data: mockRequestAccessItem.creator.education,
      })
    );
  });

  it('should open employment history dialog with correct data', () => {
    component.openEmploymentHistory(mockRequestAccessItem);

    expect(mockDialogService.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        header: 'project.contributors.table.headers.employment',
        width: '552px',
        data: mockRequestAccessItem.creator.employment,
      })
    );
  });

  it('should handle all inputs together', () => {
    const requestList = [mockRequestAccessItem];

    fixture.componentRef.setInput('requestAccessList', requestList);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('resourceType', ResourceType.Registration);
    fixture.componentRef.setInput('showEmployment', false);
    fixture.componentRef.setInput('showEducation', false);
    fixture.componentRef.setInput('showInfo', false);
    fixture.detectChanges();

    expect(component.requestAccessList()).toEqual(requestList);
    expect(component.isLoading()).toBe(true);
    expect(component.resourceType()).toBe(ResourceType.Registration);
    expect(component.showEmployment()).toBe(false);
    expect(component.showEducation()).toBe(false);
    expect(component.showInfo()).toBe(false);
  });

  it('should handle request access item updates', () => {
    const initialList = [mockRequestAccessItem];
    fixture.componentRef.setInput('requestAccessList', initialList);
    fixture.detectChanges();

    const updatedItem = { ...mockRequestAccessItem, comment: 'Updated comment' };
    const updatedList = [updatedItem];
    fixture.componentRef.setInput('requestAccessList', updatedList);
    fixture.detectChanges();

    expect(component.requestAccessList()[0].comment).toBe('Updated comment');
  });
});
