import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { FileBrowserInfoComponent } from './file-browser-info.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileBrowserInfoComponent', () => {
  let component: FileBrowserInfoComponent;
  let fixture: ComponentFixture<FileBrowserInfoComponent>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: jest.Mocked<DynamicDialogConfig>;

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn(),
    };

    const dialogConfigMock = {
      data: ResourceType.Project,
    };

    await TestBed.configureTestingModule({
      imports: [FileBrowserInfoComponent, OSFTestingModule],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileBrowserInfoComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef) as jest.Mocked<DynamicDialogRef>;
    dialogConfig = TestBed.inject(DynamicDialogConfig) as jest.Mocked<DynamicDialogConfig>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.dialogRef).toBeDefined();
    expect(component.config).toBeDefined();
    expect(component.infoItems).toBeDefined();
    expect(component.resourceType()).toBe(ResourceType.Project);
  });

  it('should compute resourceType from config data', () => {
    expect(component.resourceType()).toBe(ResourceType.Project);
  });

  it('should default to Project when config data is undefined', () => {
    dialogConfig.data = undefined;
    fixture.detectChanges();

    expect(component.resourceType()).toBe(ResourceType.Project);
  });

  it('should close dialog when close method is called', () => {
    component.dialogRef.close();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
