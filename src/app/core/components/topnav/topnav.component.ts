import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'osf-topnav',
  imports: [],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopnavComponent {}
