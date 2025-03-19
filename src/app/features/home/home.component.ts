import { Component, computed, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Project } from '@osf/features/home/models/project.entity';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { IS_PORTRAIT, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { Carousel } from 'primeng/carousel';
import { noteworthy, mostPopular, projects } from '@osf/features/home/data';

@Component({
  selector: 'osf-home',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    TableModule,
    DatePipe,
    RouterLink,
    Button,
    SubHeaderComponent,
    Carousel,
    NgOptimizedImage,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #isPortrait$ = inject(IS_PORTRAIT);
  #isXSmall$ = inject(IS_XSMALL);
  isPortrait = toSignal(this.#isPortrait$);
  isXSmall = toSignal(this.#isXSmall$);
  projects: Project[] = projects;
  noteworthy = noteworthy;
  mostPopular = mostPopular;

  searchValue = signal('');

  filteredProjects = computed(() => {
    const search = this.searchValue().toLowerCase();
    return this.projects.filter(
      (project) =>
        project.title.toLowerCase().includes(search) ||
        project.bibliographicContributors.some((i) =>
          i.unregisteredContributor.toLowerCase().includes(search),
        ),
    );
  });

  getContributorsList(item: Project) {
    return this.projects
      .find((i) => i.id === item.id)
      ?.bibliographicContributors.map((i) => i.unregisteredContributor)
      .join(', ');
  }
}
