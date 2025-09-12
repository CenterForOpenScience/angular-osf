import { TranslatePipe } from '@ngx-translate/core';

import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WikiVersion } from '@osf/shared/models';

import { MarkdownComponent } from '../../markdown/markdown.component';

@Component({
  selector: 'osf-view-section',
  imports: [PanelModule, Select, FormsModule, TranslatePipe, Skeleton, MarkdownComponent],
  templateUrl: './view-section.component.html',
  styleUrl: './view-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSectionComponent {
  viewOnly = input<boolean>(false);
  isLoading = input<boolean>(false);
  previewContent = input.required<string>();
  versions = input.required<WikiVersion[]>();
  versionContent = input.required<string>();
  selectVersion = output<string>();

  previewOption = {
    label: 'Preview',
    value: null,
  };

  selectedVersion = signal<string | null>(null);

  content = computed(() => {
    return this.selectedVersion() === null ? this.previewContent() : this.versionContent();
  });

  mappedVersions = computed(() => [
    this.previewOption,
    ...this.versions().map((version, index) => {
      const labelPrefix = index === 0 ? '(Current)' : `(${this.versions().length - index})`;
      return {
        label: `${labelPrefix} ${version.createdBy}: (${new Date(version.createdAt).toLocaleString()})`,
        value: version.id,
      };
    }),
  ]);

  constructor() {
    effect(() => {
      const versions = this.versions();
      if (versions?.length && this.viewOnly()) {
        this.selectedVersion.set(versions[0]?.id || null);
        this.selectVersion.emit(versions[0]?.id);
      } else {
        this.selectedVersion.set(null);
      }
    });
  }

  onVersionChange(versionId: string): void {
    this.selectedVersion.set(versionId);
    if (versionId) {
      this.selectVersion.emit(versionId);
    }
  }
}
