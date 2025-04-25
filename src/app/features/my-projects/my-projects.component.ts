import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_MEDIUM, IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TabOption } from '@shared/entities/tab-option.interface';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { Project } from '@osf/features/home/models/project.entity';
import { DatePipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { AddProjectFormComponent } from './add-project-form/add-project-form.component';
import { GetProjects, HomeSelectors } from 'src/app/features/home/store';
import { Store } from '@ngxs/store';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'osf-my-projects',
  imports: [
    SubHeaderComponent,
    DropdownModule,
    ReactiveFormsModule,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    SearchInputComponent,
    FormsModule,
    DatePipe,
    TableModule,
    NgClass,
    RouterOutlet,
  ],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsComponent implements OnInit {
  readonly #dialogService = inject(DialogService);
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  protected readonly defaultTabValue = 0;
  protected readonly isDesktop = toSignal(inject(IS_WEB));
  protected readonly isTablet = toSignal(inject(IS_MEDIUM));
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions: TabOption[] = [
    { label: 'My Projects', value: 0 },
    { label: 'My Registrations', value: 1 },
    { label: 'My Preprints', value: 2 },
    { label: 'Bookmarks', value: 3 },
  ];
  protected readonly searchValue = signal('');
  protected readonly projects = this.#store.selectSignal(
    HomeSelectors.getProjects,
  );
  protected readonly selectedTab = signal<number>(this.defaultTabValue);
  readonly activeProject = signal<Project | null>(null);

  filteredProjects = computed(() => {
    const search = this.searchValue().toLowerCase();
    return this.projects().filter(
      (project) =>
        project.title.toLowerCase().includes(search) ||
        project.bibliographicContributors.some((i) =>
          i.users.familyName.toLowerCase().includes(search),
        ),
    );
  });

  getContributorsList(item: Project) {
    return this.projects()
      .find((i) => i.id === item.id)
      ?.bibliographicContributors.map((i) => i.users.familyName)
      .join(', ');
  }

  createProject(): void {
    let dialogWidth = '850px';

    if (this.isMobile()) {
      dialogWidth = '95vw';
    }

    this.#dialogService.open(AddProjectFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: 'Create Project',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  navigateToProject(project: Project): void {
    this.activeProject.set(project);
    this.#router.navigate(['/my-projects', project.id]);
  }

  ngOnInit() {
    this.#store.dispatch(GetProjects);
  }
}
