import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { User } from '@osf/shared/models';
import { CitationFormatPipe } from '@osf/shared/pipes';

@Component({
  selector: 'osf-citation-preview',
  imports: [TranslatePipe, CitationFormatPipe],
  templateUrl: './citation-preview.component.html',
  styleUrl: './citation-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationPreviewComponent {
  currentUser = input.required<Partial<User>>();
}
