import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'osf-registries',
  imports: [RouterOutlet],
  templateUrl: './registries.component.html',
  styleUrl: './registries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesComponent {}
