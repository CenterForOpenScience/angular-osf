import { TranslatePipe } from '@ngx-translate/core';

import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WikiVersion } from '@osf/shared/models';

import * as Diff from 'diff';

@Component({
  selector: 'osf-compare-section',
  imports: [PanelModule, Select, FormsModule, TranslatePipe, Skeleton],
  templateUrl: './compare-section.component.html',
  styleUrl: './compare-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareSectionComponent {
  versions = input.required<WikiVersion[]>();
  versionContent = input.required<string>();
  previewContent = input.required<string>();
  isLoading = input.required<boolean>();
  selectVersion = output<string>();

  selectedVersion: string | null = null;

  mappedVersions = computed(() => [
    ...this.versions().map((version, index) => {
      const labelPrefix = index === 0 ? '(Current)' : `(${this.versions().length - index})`;
      return {
        label: `${labelPrefix} ${version.createdBy}: (${new Date(version.createdAt).toLocaleString()})`,
        value: version.id,
      };
    }),
  ]);

  content = computed(() => {
    const changes = Diff.diffWords(this.versionContent(), this.previewContent());
    return changes
      .map((change) => {
        if (change.added) {
          return `<span class="added">${change.value}</span>`;
        } else if (change.removed) {
          return `<span class="removed">${change.value}</span>`;
        }
        return change.value;
      })
      .join('');
  });

  constructor() {
    effect(() => {
      this.selectedVersion = this.versions()[0].id;
      this.selectVersion.emit(this.selectedVersion);
    });
  }
  onVersionChange(versionId: string): void {
    this.selectedVersion = versionId;
    this.selectVersion.emit(versionId);
  }
}
