import { provideStore, Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@core/store/user';
import { ProjectModel } from '@osf/shared/models/projects/projects.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { ProjectsState } from '@shared/stores/projects';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ProjectSelectorComponent } from './project-selector.component';

const makeProject = (id: string, isPublic: boolean): ProjectModel =>
  ({ id, title: `Project ${id}`, isPublic }) as ProjectModel;

describe('ProjectSelectorComponent', () => {
  let component: ProjectSelectorComponent;
  let fixture: ComponentFixture<ProjectSelectorComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectSelectorComponent],
      providers: [provideOSFCore(), MockProvider(ToastService), provideStore([ProjectsState, UserState])],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle project selection', () => {
    vi.spyOn(component.projectChange, 'emit');
    const mockProject = { id: '1', title: 'Test Project' } as any;
    const mockEvent = { value: mockProject };

    component.handleProjectChange(mockEvent as any);

    expect(component.projectChange.emit).toHaveBeenCalledWith(mockProject);
  });

  it('should handle filter search', () => {
    const mockEvent = {
      originalEvent: { preventDefault: vi.fn() },
      filter: 'test filter',
    };

    component.handleFilterSearch(mockEvent as any);

    expect(mockEvent.originalEvent.preventDefault).toHaveBeenCalled();
  });

  describe('publicOnly filtering', () => {
    const publicProject = makeProject('1', true);
    const privateProject = makeProject('2', false);

    const setProjects = (projects: ProjectModel[]) => {
      store.reset({
        ...store.snapshot(),
        projects: { projects: { data: projects, isLoading: false, error: null } },
      });
    };

    it('should show all projects when publicOnly is false', () => {
      fixture.componentRef.setInput('publicOnly', false);
      setProjects([publicProject, privateProject]);
      fixture.detectChanges();

      const ids = component.projectsOptions().map((o) => o.value.id);
      expect(ids).toContain('1');
      expect(ids).toContain('2');
    });

    it('should only show public projects when publicOnly is true', () => {
      fixture.componentRef.setInput('publicOnly', true);
      setProjects([publicProject, privateProject]);
      fixture.detectChanges();

      const ids = component.projectsOptions().map((o) => o.value.id);
      expect(ids).toContain('1');
      expect(ids).not.toContain('2');
    });
  });
});
