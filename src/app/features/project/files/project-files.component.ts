import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  FileItem,
  FILES,
} from '@osf/features/project/files/project-files.entities';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-project-files',
  imports: [
    TableModule,
    DropdownModule,
    Button,
    DatePipe,
    Select,
    FloatLabel,
    SubHeaderComponent,
    SearchInputComponent,
  ],
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilesComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';
  protected readonly files = signal(FILES);
  protected readonly folderOpened = signal(false);
  protected readonly selectFile = signal<FileItem | null>(null);
  readonly #router = inject(Router);

  selectFolder(folder: FileItem): void {
    if (this.folderOpened()) {
      this.folderOpened.set(false);
      this.files.set(FILES);

      return;
    }

    if (folder.children && folder.children.length > 0) {
      this.folderOpened.set(true);
      this.files.set([folder, ...folder.children]);
    }
  }

  navigateToFile(file: FileItem): void {
    if (file.type === 'file') {
      this.#router.navigate(['/my-projects', 'project', 'files', file.id]);
    }
  }
}
