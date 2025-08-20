import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { CustomOption } from '@shared/models';
import { Project } from '@shared/models/projects';
import { GetProjects } from '@shared/stores';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

@Component({
  selector: 'osf-project-selector',
  imports: [Select, TranslatePipe, FormsModule],
  templateUrl: './project-selector.component.html',
  styleUrl: './project-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSelectorComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();
  private readonly filterSubject = new Subject<string>();

  protected projects = select(ProjectsSelectors.getProjects);
  protected isProjectsLoading = select(ProjectsSelectors.getProjectsLoading);
  protected currentUser = select(UserSelectors.getCurrentUser);

  placeholder = input<string>('common.buttons.select');
  showClear = input<boolean>(true);
  selectedProject = model<Project | null>(null);

  projectChange = output<Project | null>();

  protected projectsOptions = signal<CustomOption<Project>[]>([]);

  protected filterMessage = computed(() => {
    const isLoading = this.isProjectsLoading();
    return isLoading
      ? this.translateService.instant('collections.addToCollection.form.loadingPlaceholder')
      : this.translateService.instant('collections.addToCollection.form.noProjectsFound');
  });

  protected actions = createDispatchMap({
    getProjects: GetProjects,
  });

  constructor() {
    this.setupEffects();
    this.setupFilterDebounce();
  }

  handleProjectChange(event: SelectChangeEvent): void {
    const project = event.value;
    this.selectedProject.set(project);
    this.projectChange.emit(project);
  }

  handleFilterSearch(event: SelectFilterEvent): void {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  private setupEffects(): void {
    effect(() => {
      const currentUser = this.currentUser();
      if (currentUser) {
        this.actions.getProjects(currentUser.id);
      }
    });

    effect(() => {
      const isProjectsLoading = this.isProjectsLoading();
      const projects = this.projects();

      if (isProjectsLoading || !projects.length) {
        this.projectsOptions.set([]);
        return;
      }

      const options = projects.map((project) => ({
        label: project.title,
        value: project,
      }));

      this.projectsOptions.set(options);
    });

    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.destroy$.next();
        this.destroy$.complete();
      });
    });
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        const currentUser = this.currentUser();
        if (!currentUser) return;

        const params: Record<string, string> = {
          'filter[current_user_permissions]': 'admin',
          'filter[title]': filterValue,
        };

        this.actions.getProjects(currentUser.id, params);
      });
  }
}
