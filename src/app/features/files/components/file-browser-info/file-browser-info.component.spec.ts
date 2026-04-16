import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mocked } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { FileBrowserInfoComponent } from './file-browser-info.component';

describe('FileBrowserInfoComponent', () => {
  let component: FileBrowserInfoComponent;
  let fixture: ComponentFixture<FileBrowserInfoComponent>;
  let dialogRef: DynamicDialogRef;
  let dialogConfig: Mocked<DynamicDialogConfig>;

  beforeEach(() => {
    const dialogConfigMock = { data: ResourceType.Project };

    TestBed.configureTestingModule({
      imports: [FileBrowserInfoComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig, dialogConfigMock)],
    });

    fixture = TestBed.createComponent(FileBrowserInfoComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    dialogConfig = TestBed.inject(DynamicDialogConfig) as Mocked<DynamicDialogConfig>;
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
