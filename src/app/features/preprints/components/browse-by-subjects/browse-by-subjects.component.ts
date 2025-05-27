import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-browse-by-subjects',
  imports: [Card],
  templateUrl: './browse-by-subjects.component.html',
  styleUrl: './browse-by-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseBySubjectsComponent {}
