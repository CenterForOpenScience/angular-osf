import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInfoTooltipComponent } from './resource-tooltip-info.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ResourceInfoTooltipComponent', () => {
  let component: ResourceInfoTooltipComponent;
  let fixture: ComponentFixture<ResourceInfoTooltipComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceInfoTooltipComponent, OSFTestingModule],
      providers: [MockProvider(DynamicDialogRef), MockProvider(DynamicDialogConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceInfoTooltipComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize resourceName from config data', () => {
    const testResourceName = 'Test Resource';
    config.data = testResourceName;

    fixture = TestBed.createComponent(ResourceInfoTooltipComponent);
    component = fixture.componentInstance;

    expect(component.resourceName).toBe(testResourceName);
  });

  it('should close dialog when close is called', () => {
    const closeSpy = jest.spyOn(dialogRef, 'close');

    dialogRef.close();

    expect(closeSpy).toHaveBeenCalled();
  });
});
