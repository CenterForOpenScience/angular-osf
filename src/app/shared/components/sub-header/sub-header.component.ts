import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'osf-sub-header',
  imports: [Button],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss',
  standalone: true,
})
export class SubHeaderComponent {
  showButton = input<boolean>(false);
  buttonLabel = input<string>('');
  title = input<string>('');
  icon = input<string>('');
  buttonClick = output<void>();
}
