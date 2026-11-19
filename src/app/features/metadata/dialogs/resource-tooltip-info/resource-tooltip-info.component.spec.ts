import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { ResourceInfoTooltipComponent } from './resource-tooltip-info.component';

describe('ResourceInfoTooltipComponent', () => {
  let component: ResourceInfoTooltipComponent;
  let fixture: ComponentFixture<ResourceInfoTooltipComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourceInfoTooltipComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock()],
    });

    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ResourceInfoTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use project as resource name', () => {
    expect(component.resourceName).toBe('project');
  });

  it('should close dialog when close is called', () => {
    const closeSpy = vi.spyOn(dialogRef, 'close');

    dialogRef.close();

    expect(closeSpy).toHaveBeenCalled();
  });
});
