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

  it('should initialize with default inputs', () => {
    expect(component.selectedFilesCount()).toBe(0);
    expect(component.canUpdateFiles()).toBe(true);
    expect(component.hasViewOnly()).toBe(false);
    expect(component.isProjectReadOnly()).toBe(false);
  });

  it('should update selected files count input', () => {
    fixture.componentRef.setInput('selectedFilesCount', 3);
    fixture.detectChanges();

    expect(component.selectedFilesCount()).toBe(3);
  });

  it('should update canUpdateFiles input', () => {
    fixture.componentRef.setInput('canUpdateFiles', false);
    fixture.detectChanges();

    expect(component.canUpdateFiles()).toBe(false);
  });

  it('should update hasViewOnly input', () => {
    fixture.componentRef.setInput('hasViewOnly', true);
    fixture.detectChanges();

    expect(component.hasViewOnly()).toBe(true);
  });

  it('should handle isProjectReadOnly input', () => {
    fixture.componentRef.setInput('isProjectReadOnly', true);
    fixture.detectChanges();

    expect(component.isProjectReadOnly()).toBe(true);
  });

  it('should emit copySelected event', () => {
    const copySelectedSpy = vi.spyOn(component.copySelected, 'emit');

    component.copySelected.emit();

    expect(copySelectedSpy).toHaveBeenCalled();
  });

  it('should emit moveSelected output', () => {
    const moveSelectedSpy = vi.spyOn(component.moveSelected, 'emit');

    component.moveSelected.emit();

    expect(moveSelectedSpy).toHaveBeenCalled();
  });

  it('should emit deleteSelected output', () => {
    const deleteSelectedSpy = vi.spyOn(component.deleteSelected, 'emit');

    component.deleteSelected.emit();

    expect(deleteSelectedSpy).toHaveBeenCalled();
  });

  it('should emit clearSelection output', () => {
    const clearSelectionSpy = vi.spyOn(component.clearSelection, 'emit');

    component.clearSelection.emit();

    expect(clearSelectionSpy).toHaveBeenCalled();
  });
});
