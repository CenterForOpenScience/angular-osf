import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { WikiVersion } from '@shared/models';

import { CompareSectionComponent } from './compare-section.component';

import { TranslateServiceMock } from '@testing/mocks';

describe('CompareSectionComponent', () => {
  let component: CompareSectionComponent;
  let fixture: ComponentFixture<CompareSectionComponent>;

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

  const mockVersionContent = 'Original content';
  const mockPreviewContent = 'Updated content with changes';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareSectionComponent, FormsModule],
      providers: [TranslateServiceMock, provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('versions', mockVersions);
    fixture.componentRef.setInput('versionContent', mockVersionContent);
    fixture.componentRef.setInput('previewContent', mockPreviewContent);
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should emit selectVersion when version changes', () => {
    const emitSpy = jest.spyOn(component.selectVersion, 'emit');
    const versionId = 'version-2';

    component.onVersionChange(versionId);

    expect(component.selectedVersion).toBe(versionId);
    expect(emitSpy).toHaveBeenCalledWith(versionId);
  });

  it('should handle single version', () => {
    const singleVersion = [mockVersions[0]];
    fixture.componentRef.setInput('versions', singleVersion);
    fixture.detectChanges();

    const mappedVersions = component.mappedVersions();
    expect(mappedVersions).toHaveLength(1);
    expect(mappedVersions[0].label).toContain('(Current)');
  });

  it('should initialize with first version selected', () => {
    expect(component.selectedVersion).toBe(mockVersions[0].id);
  });
});
