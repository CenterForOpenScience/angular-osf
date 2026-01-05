import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WikiVersion } from '@osf/shared/models/wiki/wiki.model';

import { MarkdownComponent } from '../../markdown/markdown.component';

@Component({
  selector: 'osf-view-section',
  imports: [Panel, Select, FormsModule, TranslatePipe, Skeleton, MarkdownComponent],
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

  translateService = inject(TranslateService);

  selectedVersion = signal<string | null>(null);

  content = computed(() => (this.selectedVersion() === null ? this.previewContent() : this.versionContent()));

  private readonly previewLabel = this.translateService.instant('project.wiki.version.preview');
  private readonly currentLabel = this.translateService.instant('project.wiki.version.current');
  private readonly unknownAuthorLabel = this.translateService.instant('project.wiki.version.unknownAuthor');

  mappedVersions = computed(() => [
    { label: this.previewLabel, value: null },
    ...this.versions().map((version, index) => ({
      label: this.formatVersionLabel(version, index),
      value: version.id,
    })),
  ]);

  constructor() {
    effect(() => {
      const versions = this.versions();
      if (versions?.length || this.viewOnly()) {
        this.selectedVersion.set(versions[0]?.id || null);
        this.selectVersion.emit(versions[0]?.id);
      } else {
        this.selectedVersion.set(null);
      }
    });
  }

  onVersionChange(versionId: string | null): void {
    this.selectedVersion.set(versionId);

    if (versionId) {
      this.selectVersion.emit(versionId);
    }
  }

  private formatVersionLabel(version: WikiVersion, index: number): string {
    const prefix = index === 0 ? `(${this.currentLabel})` : `(${this.versions().length - index})`;
    const creator = version.createdBy || this.unknownAuthorLabel;
    return `${prefix} ${creator}: (${new Date(version.createdAt).toLocaleString()})`;
  }
}
