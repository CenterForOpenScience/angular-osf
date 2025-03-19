import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateDeveloperAppComponent } from '@osf/features/settings/developer-apps/create-developer-app/create-developer-app.component';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent],
  templateUrl: './developer-apps-container.component.html',
  styleUrl: './developer-apps-container.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsContainerComponent {
  private readonly dialogService = inject(DialogService);

  createDeveloperApp(): void {
    this.dialogService.open(CreateDeveloperAppComponent, {
      width: '448px',
      focusOnShow: false,
      header: 'Create Developer App',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
