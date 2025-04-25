import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'osf-project',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent {
  @HostBinding('class') classes = 'flex flex-1 flex-column gap-4 w-full h-full';
}
