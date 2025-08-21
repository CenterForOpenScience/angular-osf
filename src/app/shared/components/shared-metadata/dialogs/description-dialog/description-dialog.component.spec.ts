import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverview } from '@osf/features/project/overview/models';
import { MOCK_PROJECT_OVERVIEW, TranslateServiceMock } from '@shared/mocks';

import { DescriptionDialogComponent } from './description-dialog.component';

describe('DescriptionDialogComponent', () => {
  let component: DescriptionDialogComponent;
  let fixture: ComponentFixture<DescriptionDialogComponent>;

  const mockProjectWithDescription: ProjectOverview = MOCK_PROJECT_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionDialogComponent],
      providers: [TranslateServiceMock, MockProvider(DynamicDialogRef), MockProvider(DynamicDialogConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set description control value when project has description', () => {
    Object.defineProperty(component, 'currentProject', {
      get: () => mockProjectWithDescription,
    });

    component.ngOnInit();

    expect(component.descriptionControl.value).toBe('Test Description');
  });

  it('should not set description control value when currentProject is null', () => {
    Object.defineProperty(component, 'currentProject', {
      get: () => null,
    });

    component.ngOnInit();

    expect(component.descriptionControl.value).toBe('');
  });

  it('should handle save with valid form', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    jest.spyOn(dialogRef, 'close');
    const validDescription = 'Valid description';

    component.descriptionControl.setValue(validDescription);
    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith(validDescription);
  });

  it('should handle cancel', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    jest.spyOn(dialogRef, 'close');

    component.cancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should return currentProject when config.data exists and has currentProject', () => {
    const config = TestBed.inject(DynamicDialogConfig);
    (config as any).data = { currentProject: mockProjectWithDescription };

    expect(component.currentProject).toBe(mockProjectWithDescription);
  });
});
