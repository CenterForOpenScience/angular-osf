import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Chips } from 'primeng/chips';

import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProjectOverview } from '@osf/features/project/overview/models';

@Component({
  selector: 'osf-project-metadata-tags',
  imports: [Card, TranslatePipe, FormsModule, Chips],
  templateUrl: './project-metadata-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataTagsComponent {
  tagsChanged = output<string[]>();

  currentProject = input.required<ProjectOverview | null>();

  currentTags = signal<string[]>([]);
  suggestedTags = signal<string[]>([]);

  constructor() {
    effect(() => {
      const project = this.currentProject();
      this.currentTags.set(project ? project.tags || [] : []);
    });
  }

  onTagsChange(tags: string[]): void {
    this.currentTags.set(tags);
    this.tagsChanged.emit(tags);
  }

  searchTags(event: { query: string }): void {
    this.suggestedTags.set([...this.suggestedTags(), event.query]);
  }
}
