import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';

@Component({
  selector: 'osf-resource-doi',
  imports: [Skeleton, TranslatePipe],
  templateUrl: './resource-doi.component.html',
  styleUrl: './resource-doi.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDoiComponent {
  identifiers = input<IdentifierModel[]>([]);
  isLoading = input<boolean>(false);
}
