import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiVersion } from '@shared/models/wiki/wiki.model';

import { CompareSectionComponent } from './compare-section.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CompareSectionComponent', () => {
  let component: CompareSectionComponent;
  let fixture: ComponentFixture<CompareSectionComponent>;
  let translateServiceMock: any;

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
    {
      id: 'version-3',
      createdAt: '2024-01-03T10:00:00Z',
      createdBy: 'Bob Johnson',
    },
  ];

  const mockVersionContent = 'Original content';
  const mockPreviewContent = 'Updated content with changes';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareSectionComponent, OSFTestingModule],
      providers: [TranslateServiceMock],
    }).compileComponents();

    translateServiceMock = TestBed.inject(TranslateServiceMock.provide);
    translateServiceMock.instant.mockReturnValue('Current');

    fixture = TestBed.createComponent(CompareSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('versions', mockVersions);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.componentRef.setInput('previewContent', mockPreviewContent);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
  });

  it('should set versions input', () => {
    expect(component.versions()).toEqual(mockVersions);
  });

  it('should set versionContent input', () => {
    expect(component.versionContent()).toBe(mockVersionContent);
  });

  it('should set previewContent input', () => {
    expect(component.previewContent()).toBe(mockPreviewContent);
  });

  it('should set isLoading input', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should handle empty versions array', () => {
    fixture.componentRef.setInput('versions', []);
    fixture.detectChanges();

    expect(component.versions()).toEqual([]);
    expect(component.selectedVersion).toBeUndefined();
  });

  it('should initialize with first version selected and emit selectVersion', () => {
    expect(component.selectedVersion).toBe(mockVersions[0].id);
  });

  it('should not emit when no versions available', () => {
    const emitSpy = jest.spyOn(component.selectVersion, 'emit');

    fixture.componentRef.setInput('versions', []);
    fixture.detectChanges();

    expect(component.selectedVersion).toBeUndefined();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should map versions correctly', () => {
    const mappedVersions = component.mappedVersions();

    expect(mappedVersions).toHaveLength(3);
    expect(mappedVersions[0].value).toBe('version-1');
    expect(mappedVersions[0].label).toContain('(Current)');
    expect(mappedVersions[0].label).toContain('John Doe');
    expect(mappedVersions[1].value).toBe('version-2');
    expect(mappedVersions[1].label).toContain('(2)');
    expect(mappedVersions[1].label).toContain('Jane Smith');
    expect(mappedVersions[2].value).toBe('version-3');
    expect(mappedVersions[2].label).toContain('(1)');
    expect(mappedVersions[2].label).toContain('Bob Johnson');
  });

  it('should handle version with undefined createdBy', () => {
    const versionsWithUndefinedCreator: WikiVersion[] = [
      {
        id: 'version-1',
        createdAt: '2024-01-01T10:00:00Z',
        createdBy: undefined,
      },
    ];

    fixture.componentRef.setInput('versions', versionsWithUndefinedCreator);
    fixture.detectChanges();

    const mappedVersions = component.mappedVersions();
    expect(mappedVersions).toHaveLength(1);
    expect(mappedVersions[0].value).toBe('version-1');
    expect(mappedVersions[0].label).toContain('(Current)');
    expect(mappedVersions[0].label).toContain('1/1/2024');
  });

  it('should handle single version', () => {
    const singleVersion = [mockVersions[0]];
    fixture.componentRef.setInput('versions', singleVersion);
    fixture.detectChanges();

    const mappedVersions = component.mappedVersions();
    expect(mappedVersions).toHaveLength(1);
    expect(mappedVersions[0].label).toContain('(Current)');
  });

  it('should compute content diff correctly', () => {
    const content = component.content();

    expect(content).toContain('<span class="removed">Original</span>');
    expect(content).toContain('<span class="added">Updated</span>');
    expect(content).toContain('content');
    expect(content).toContain('<span class="added">with changes</span>');
  });

  it('should handle identical content', () => {
    fixture.componentRef.setInput('previewContent', mockVersionContent);
    fixture.detectChanges();

    const content = component.content();
    expect(content).toBe(mockVersionContent);
  });

  it('should handle empty version content', () => {
    fixture.componentRef.setInput('versionContent', '');
    fixture.detectChanges();

    const content = component.content();
    expect(content).toContain('<span class="added">Updated content with changes</span>');
  });

  it('should handle empty preview content', () => {
    fixture.componentRef.setInput('previewContent', '');
    fixture.detectChanges();

    const content = component.content();
    expect(content).toContain('<span class="removed">Original content</span>');
  });

  it('should update selectedVersion and emit selectVersion', () => {
    const emitSpy = jest.spyOn(component.selectVersion, 'emit');
    const versionId = 'version-2';

    component.onVersionChange(versionId);

    expect(component.selectedVersion).toBe(versionId);
    expect(emitSpy).toHaveBeenCalledWith(versionId);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit correct version id when called multiple times', () => {
    const emitSpy = jest.spyOn(component.selectVersion, 'emit');

    component.onVersionChange('version-2');
    component.onVersionChange('version-3');
    component.onVersionChange('version-1');

    expect(component.selectedVersion).toBe('version-1');
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy).toHaveBeenNthCalledWith(1, 'version-2');
    expect(emitSpy).toHaveBeenNthCalledWith(2, 'version-3');
    expect(emitSpy).toHaveBeenNthCalledWith(3, 'version-1');
  });
});
