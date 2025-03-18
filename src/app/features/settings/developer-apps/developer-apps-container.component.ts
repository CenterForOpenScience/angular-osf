import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-developer-apps',
  imports: [RouterOutlet, SubHeaderComponent],
  templateUrl: './developer-apps-container.component.html',
  styleUrl: './developer-apps-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsContainerComponent {
  onCreateDeveloperAppBtnClicked(): void {
    //TODO integrate API
  }
}
