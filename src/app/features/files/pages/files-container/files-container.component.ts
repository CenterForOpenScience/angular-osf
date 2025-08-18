import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'osf-files-container',
  imports: [RouterOutlet],
  templateUrl: './files-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesContainerComponent {}
