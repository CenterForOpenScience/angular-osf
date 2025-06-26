import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProjectFilesSelectors, UpdateTags } from '@osf/features/project/files/store';
import { InputLimits } from '@shared/constants';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'osf-file-keywords',
  imports: [Button, Chip, Skeleton, InputText, ReactiveFormsModule, TranslatePipe],
  templateUrl: './file-keywords.component.html',
  styleUrls: ['./file-keywords.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileKeywordsComponent {
  private readonly actions = createDispatchMap({ updateTags: UpdateTags });
  private readonly destroyRef = inject(DestroyRef);

  readonly tags = select(ProjectFilesSelectors.getFileTags);
  readonly isTagsLoading = select(ProjectFilesSelectors.isFileTagsLoading);
  readonly file = select(ProjectFilesSelectors.getOpenedFile);

  keywordControl = new FormControl('', {
    nonNullable: true,
    validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(InputLimits.name.maxLength)],
  });

  addTag(): void {
    const fileGuid = this.file()?.guid;

    if (this.keywordControl.value && fileGuid) {
      const updatedTags = [...this.tags(), this.keywordControl.value!];
      this.updateTags(updatedTags, fileGuid);
    }
  }

  deleteTag(value: string): void {
    const fileGuid = this.file()?.guid;

    if (fileGuid) {
      const updatedTags = [...this.tags()];
      updatedTags.splice(updatedTags.indexOf(value), 1);
      this.updateTags(updatedTags, fileGuid);
    }
  }

  private updateTags(updatedTags: string[], fileGuid: string) {
    this.actions
      .updateTags(updatedTags, fileGuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.keywordControl.reset());
  }
}
