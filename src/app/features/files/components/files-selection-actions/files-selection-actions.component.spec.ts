import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSelectionActionsComponent } from './files-selection-actions.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FilesSelectionActionsComponent', () => {
  let component: FilesSelectionActionsComponent;
  let fixture: ComponentFixture<FilesSelectionActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesSelectionActionsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesSelectionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedFiles()).toEqual([]);
    expect(component.canUpdateFiles()).toBe(true);
    expect(component.hasViewOnly()).toBe(false);
  });

  it('should handle canUpdateFiles input', () => {
    fixture.componentRef.setInput('canUpdateFiles', false);
    fixture.detectChanges();

    expect(component.canUpdateFiles()).toBe(false);
  });

  it('should handle hasViewOnly input', () => {
    fixture.componentRef.setInput('hasViewOnly', true);
    fixture.detectChanges();

    expect(component.hasViewOnly()).toBe(true);
  });

  it('should emit copySelected event', () => {
    const copySelectedSpy = jest.spyOn(component.copySelected, 'emit');

    component.copySelected.emit();

    expect(copySelectedSpy).toHaveBeenCalled();
  });

  it('should emit moveSelected event', () => {
    const moveSelectedSpy = jest.spyOn(component.moveSelected, 'emit');

    component.moveSelected.emit();

    expect(moveSelectedSpy).toHaveBeenCalled();
  });

  it('should emit deleteSelected event', () => {
    const deleteSelectedSpy = jest.spyOn(component.deleteSelected, 'emit');

    component.deleteSelected.emit();

    expect(deleteSelectedSpy).toHaveBeenCalled();
  });

  it('should emit clearSelection event', () => {
    const clearSelectionSpy = jest.spyOn(component.clearSelection, 'emit');

    component.clearSelection.emit();

    expect(clearSelectionSpy).toHaveBeenCalled();
  });

  it('should have all required outputs defined', () => {
    expect(component.copySelected).toBeDefined();
    expect(component.moveSelected).toBeDefined();
    expect(component.deleteSelected).toBeDefined();
    expect(component.clearSelection).toBeDefined();
  });

  it('should handle empty selected files array', () => {
    fixture.componentRef.setInput('selectedFiles', []);
    fixture.detectChanges();

    expect(component.selectedFiles()).toEqual([]);
  });
});
