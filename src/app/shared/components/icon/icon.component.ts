import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'osf-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  iconClass = input<string>('');
}
