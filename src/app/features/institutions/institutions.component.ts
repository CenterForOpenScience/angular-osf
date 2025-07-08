import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'osf-institutions',
  imports: [RouterOutlet],
  templateUrl: './institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsComponent {}
