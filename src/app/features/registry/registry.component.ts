import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'osf-registry',
  imports: [RouterOutlet],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column';
}
