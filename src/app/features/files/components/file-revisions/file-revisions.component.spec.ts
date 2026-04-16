import { MockComponents, MockDirective } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyButtonComponent } from '@osf/shared/components/copy-button/copy-button.component';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { FileRevisionsComponent } from './file-revisions.component';

describe('FileRevisionsComponent', () => {
  let component: FileRevisionsComponent;
  let fixture: ComponentFixture<FileRevisionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FileRevisionsComponent,
        ...MockComponents(CopyButtonComponent, InfoIconComponent),
        MockDirective(StopPropagationDirective),
      ],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(FileRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.fileRevisions()).toBeUndefined();
    expect(component.isLoading()).toBe(false);
  });

  it('should handle loading state input', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });

  it('should emit openRevision event when onOpenRevision is called', () => {
    const openRevisionSpy = vi.spyOn(component.openRevision, 'emit');

    component.onOpenRevision('1');

    expect(openRevisionSpy).toHaveBeenCalledWith('1');
  });

  it('should emit downloadRevision event when onDownloadRevision is called', () => {
    const downloadRevisionSpy = vi.spyOn(component.downloadRevision, 'emit');

    component.onDownloadRevision('2');

    expect(downloadRevisionSpy).toHaveBeenCalledWith('2');
  });

  it('should handle empty file revisions array', () => {
    fixture.componentRef.setInput('fileRevisions', []);
    fixture.detectChanges();

    expect(component.fileRevisions()).toEqual([]);
  });

  it('should handle null file revisions', () => {
    fixture.componentRef.setInput('fileRevisions', null);
    fixture.detectChanges();

    expect(component.fileRevisions()).toBeNull();
  });

  it('should have all required outputs defined', () => {
    expect(component.downloadRevision).toBeDefined();
    expect(component.openRevision).toBeDefined();
  });

  it('should handle multiple revision events', () => {
    const openRevisionSpy = vi.spyOn(component.openRevision, 'emit');
    const downloadRevisionSpy = vi.spyOn(component.downloadRevision, 'emit');

    component.onOpenRevision('1');
    component.onDownloadRevision('1');
    component.onOpenRevision('2');
    component.onDownloadRevision('2');

    expect(openRevisionSpy).toHaveBeenCalledTimes(2);
    expect(openRevisionSpy).toHaveBeenCalledWith('1');
    expect(openRevisionSpy).toHaveBeenCalledWith('2');

    expect(downloadRevisionSpy).toHaveBeenCalledTimes(2);
    expect(downloadRevisionSpy).toHaveBeenCalledWith('1');
    expect(downloadRevisionSpy).toHaveBeenCalledWith('2');
  });

  it('should handle loading state changes', () => {
    expect(component.isLoading()).toBe(false);

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);

    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });
});
