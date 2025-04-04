import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Project } from '@osf/features/home/models/project.entity';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from '@osf/features/home/dashboard.service';
import { Store } from '@ngxs/store';
import {
  GetMostPopular,
  GetNoteworthy,
  GetProjects,
  HomeSelectors,
} from '@core/store/home';

@Component({
  selector: 'osf-home',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    RouterLink,
    Button,
    SubHeaderComponent,
    SearchInputComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isMedium = toSignal(inject(IS_MEDIUM));
  isMobile = toSignal(inject(IS_XSMALL));
  dashboardService: DashboardService = inject(DashboardService);
  #store = inject(Store);

  protected readonly projects = this.#store.selectSignal(
    HomeSelectors.getProjects,
  );

  protected readonly noteworthy = this.#store.selectSignal(
    HomeSelectors.getNoteworthy,
  );

  protected readonly mostPopular = this.#store.selectSignal(
    HomeSelectors.getMostPopular,
  );

  searchValue = signal('');

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

  getNoteworthyContributorsList(item: Project) {
    return this.noteworthy()
      .find((i) => i.id === item.id)
      ?.bibliographicContributors.map((i) => i.users.familyName)
      .join(', ');
  }

  getMostPopularContributorsList(item: Project) {
    return this.mostPopular()
      .find((i) => i.id === item.id)
      ?.bibliographicContributors.map((i) => i.users.familyName)
      .join(', ');
  }

  ngOnInit() {
    this.#store.dispatch(GetProjects);
    this.#store.dispatch(GetNoteworthy);
    this.#store.dispatch(GetMostPopular);
  }
}
