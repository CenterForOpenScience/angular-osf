import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';

import { finalize } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StopPropagationDirective } from '@osf/shared/directives/stop-propagation.directive';

import { METADATA_DOWNLOAD_OPTION } from '../../constants/metadata-download-option.const';
import { ProjectDownloadMenuItem } from '../../models/project-download-menu-item.model';
import { ProjectDownloadOption } from '../../models/project-download-option.model';
import { ProjectDownloadOptionsService } from '../../services/project-download-options.service';

@Component({
  selector: 'osf-project-download-menu',
  imports: [Button, Menu, TranslatePipe, StopPropagationDirective],
  templateUrl: './project-download-menu.component.html',
  styleUrl: './project-download-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDownloadMenuComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly downloadOptionsService = inject(ProjectDownloadOptionsService);

  readonly projectId = input.required<string>();

  readonly menu = viewChild<Menu>('menu');
  readonly menuTrigger = viewChild.required<ElementRef<HTMLElement>>('menuTrigger');
  readonly isLoading = signal(false);
  readonly menuItems = signal<ProjectDownloadMenuItem[]>([]);

  onDownloadClick(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.downloadOptionsService
      .loadOptions(this.projectId())
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (options) => {
          this.menuItems.set(this.toMenuItems(options));
          this.openMenu();
        },
        error: () => {
          this.menuItems.set(this.toMenuItems([METADATA_DOWNLOAD_OPTION]));
          this.openMenu();
        },
      });
  }

  onMenuItemSelect(item: ProjectDownloadMenuItem, event: Event): void {
    event.stopPropagation();
    this.downloadOptionsService.executeDownload(this.projectId(), item.option);
    this.menu()?.hide();
  }

  private openMenu(): void {
    const menu = this.menu();
    const trigger = this.menuTrigger().nativeElement;

    if (!menu) {
      return;
    }

    menu.toggle({ currentTarget: trigger } as unknown as Event);
  }

  private toMenuItems(options: ProjectDownloadOption[]): ProjectDownloadMenuItem[] {
    return options.map((option) => ({
      id: option.id,
      label: option.label,
      labelParams: option.labelParams,
      option,
    }));
  }
}
