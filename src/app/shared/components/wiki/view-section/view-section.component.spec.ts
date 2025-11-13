import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { WikiVersion } from '@shared/models/wiki/wiki.model';

import { MarkdownComponent } from '../../markdown/markdown.component';

import { ViewSectionComponent } from './view-section.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';

describe('ViewSectionComponent', () => {
  let component: ViewSectionComponent;
  let fixture: ComponentFixture<ViewSectionComponent>;

  const mockVersions: WikiVersion[] = [
    {
      id: 'version-1',
      createdAt: '2024-01-01T10:00:00Z',
      createdBy: 'John Doe',
    },
    {
      id: 'version-2',
      createdAt: '2024-01-02T10:00:00Z',
      createdBy: 'Jane Smith',
    },
  ];

  const mockPreviewContent = 'Preview content';
  const mockVersionContent = 'Version content';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSectionComponent, MockComponent(MarkdownComponent)],
      providers: [TranslateServiceMock, provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('viewOnly', false);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('previewContent', mockPreviewContent);
    fixture.componentRef.setInput('versions', mockVersions);
    fixture.componentRef.setInput('versionContent', mockVersionContent);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set viewOnly input', () => {
    expect(component.viewOnly()).toBe(false);
  });

  it('should set isLoading input', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should set previewContent input', () => {
    expect(component.previewContent()).toBe(mockPreviewContent);
  });

  it('should set versions input', () => {
    expect(component.versions()).toEqual(mockVersions);
  });

  it('should set versionContent input', () => {
    expect(component.versionContent()).toBe(mockVersionContent);
  });

  it('should emit selectVersion when version changes', () => {
    const emitSpy = jest.spyOn(component.selectVersion, 'emit');
    const versionId = 'version-2';

    component.onVersionChange(versionId);

    expect(component.selectedVersion()).toBe(versionId);
    expect(emitSpy).toHaveBeenCalledWith(versionId);
  });

  it('should return preview content when no version is selected', () => {
    component.selectedVersion.set(null);

    const content = component.content();

    expect(content).toBe(mockPreviewContent);
  });

  it('should return version content when version is selected', () => {
    component.selectedVersion.set('version-1');

    const content = component.content();

    expect(content).toBe(mockVersionContent);
  });

  it('should handle empty versions array', () => {
    fixture.componentRef.setInput('versions', []);
    fixture.detectChanges();

    const mappedVersions = component.mappedVersions();
    expect(mappedVersions).toHaveLength(1);
    expect(mappedVersions[0]).toEqual({
      label: 'Preview',
      value: null,
    });
  });

  it('should handle single version', () => {
    const singleVersion = [mockVersions[0]];
    fixture.componentRef.setInput('versions', singleVersion);
    fixture.detectChanges();

    const mappedVersions = component.mappedVersions();
    expect(mappedVersions).toHaveLength(2);
    expect(mappedVersions[0].label).toBe('Preview');
    expect(mappedVersions[1].label).toContain('(Current)');
  });

  it('should render loading skeleton when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const skeletons = compiled.querySelectorAll('p-skeleton');

    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render view panel when not loading', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const panels = compiled.querySelectorAll('p-panel');

    expect(panels.length).toBeGreaterThan(0);
  });

  it('should initialize with null selected version when not viewOnly', () => {
    fixture.componentRef.setInput('versions', []);
    fixture.detectChanges();

    expect(component.selectedVersion()).toBe(null);
  });

  it('should initialize with first version selected when viewOnly is true', () => {
    fixture.componentRef.setInput('viewOnly', true);
    fixture.detectChanges();

    expect(component.selectedVersion()).toBe(mockVersions[0].id);
  });

  it('should handle empty versions when viewOnly is true', () => {
    const emitSpy = jest.spyOn(component.selectVersion, 'emit');

    fixture.componentRef.setInput('versions', []);
    fixture.componentRef.setInput('viewOnly', true);
    fixture.detectChanges();

    expect(component.selectedVersion()).toBe(null);
    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('should render markdown component when content exists', () => {
    fixture.componentRef.setInput('previewContent', 'Some content');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const markdownComponent = compiled.querySelector('osf-markdown');

    expect(markdownComponent).toBeTruthy();
  });

  it('should render no content message when content is empty', () => {
    fixture.componentRef.setInput('previewContent', '');
    fixture.componentRef.setInput('versionContent', '');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const noContentMessage = compiled.querySelector('p.font-italic');

    expect(noContentMessage).toBeTruthy();
  });
});
