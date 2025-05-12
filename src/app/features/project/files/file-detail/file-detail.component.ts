import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-file-detail',
  imports: [SubHeaderComponent, RouterLink, Button],
  templateUrl: './file-detail.component.html',
  styleUrl: './file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDetailComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 gap-4 w-full h-full';
}
