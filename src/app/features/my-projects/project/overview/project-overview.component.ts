import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Button } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'osf-project-overview',
  imports: [SubHeaderComponent, Button, NgOptimizedImage],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent {
  @HostBinding('class') classes = 'flex flex-column w-full h-full';
}
