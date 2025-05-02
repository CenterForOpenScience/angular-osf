import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { TableModule } from 'primeng/table';
import {
  FileItem,
  FILES,
} from '@osf/features/my-projects/project/files/project-files.entities';
import { Router } from '@angular/router';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'osf-project-files',
  imports: [
    SubHeaderComponent,
    TableModule,
    Select,
    FloatLabel,
    SearchInputComponent,
    DropdownModule,
    Button,
    DatePipe,
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
