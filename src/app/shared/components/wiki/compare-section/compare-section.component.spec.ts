import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiVersion } from '@osf/shared/models/wiki/wiki.model';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { CompareSectionComponent } from './compare-section.component';

import * as Diff from 'diff';

vi.mock('diff', () => ({ diffWords: vi.fn() }));

describe('CompareSectionComponent', () => {
  let component: CompareSectionComponent;
  let fixture: ComponentFixture<CompareSectionComponent>;

  const versions: WikiVersion[] = [
    {
      id: 'v3',
      createdAt: '2024-01-03T10:30:00.000Z',
      createdBy: 'Alice',
    },
    {
      id: 'v2',
      createdAt: '2024-01-02T10:30:00.000Z',
      createdBy: undefined,
    },
  ];

  beforeEach(() => {
    vi.mocked(Diff.diffWords).mockReturnValue([]);

    TestBed.configureTestingModule({
      imports: [CompareSectionComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(CompareSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('versions', versions);
    fixture.componentRef.setInput('versionContent', 'old text');
    fixture.componentRef.setInput('previewContent', 'new text');
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit first version id on init and set selectedVersion', () => {
    const emitSpy = vi.spyOn(component.selectVersion, 'emit');
    const nextVersions: WikiVersion[] = [
      {
        id: 'v9',
        createdAt: '2024-01-09T10:30:00.000Z',
        createdBy: 'Bob',
      },
      ...versions,
    ];

    fixture.componentRef.setInput('versions', nextVersions);
    fixture.detectChanges();

    expect(component.selectedVersion).toBe('v9');
    expect(emitSpy).toHaveBeenCalledWith('v9');
  });

  it('should map versions with current label and unknown author fallback', () => {
    const mapped = component.mappedVersions();

    expect(mapped.length).toBe(2);
    expect(mapped[0].value).toBe('v3');
    expect(mapped[0].label).toContain('(project.wiki.version.current)');
    expect(mapped[0].label).toContain('Alice');
    expect(mapped[1].label).toContain('project.wiki.version.unknownAuthor');
  });

  it('should update selectedVersion and emit on version change', () => {
    const emitSpy = vi.spyOn(component.selectVersion, 'emit');

    component.onVersionChange('v2');

    expect(component.selectedVersion).toBe('v2');
    expect(emitSpy).toHaveBeenCalledWith('v2');
  });

  it('should render diff words with added and removed wrappers', () => {
    vi.mocked(Diff.diffWords).mockReturnValue([
      { value: 'same ', added: false, removed: false, count: 1 },
      { value: 'removed', added: false, removed: true, count: 1 },
      { value: 'added', added: true, removed: false, count: 1 },
    ]);

    fixture.componentRef.setInput('versionContent', 'same removed');
    fixture.componentRef.setInput('previewContent', 'same added');
    fixture.detectChanges();

    expect(component.content()).toBe('same <span class="removed">removed</span><span class="added">added</span>');
  });

  it('should render loading skeletons when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
