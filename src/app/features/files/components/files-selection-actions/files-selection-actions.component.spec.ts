import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { FilesSelectionActionsComponent } from './files-selection-actions.component';

describe('FilesSelectionActionsComponent', () => {
  let component: FilesSelectionActionsComponent;
  let fixture: ComponentFixture<FilesSelectionActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilesSelectionActionsComponent],
      providers: [provideOSFCore()],
    });

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
    const copySelectedSpy = vi.spyOn(component.copySelected, 'emit');

    component.copySelected.emit();

    expect(copySelectedSpy).toHaveBeenCalled();
  });

  it('should emit moveSelected event', () => {
    const moveSelectedSpy = vi.spyOn(component.moveSelected, 'emit');

    component.moveSelected.emit();

    expect(moveSelectedSpy).toHaveBeenCalled();
  });

  it('should emit deleteSelected event', () => {
    const deleteSelectedSpy = vi.spyOn(component.deleteSelected, 'emit');

    component.deleteSelected.emit();

    expect(deleteSelectedSpy).toHaveBeenCalled();
  });

  it('should emit clearSelection event', () => {
    const clearSelectionSpy = vi.spyOn(component.clearSelection, 'emit');

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
