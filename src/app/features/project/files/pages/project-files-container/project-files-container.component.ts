import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'osf-project-files-container',
  imports: [RouterOutlet],
  templateUrl: './project-files-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilesContainerComponent {}
