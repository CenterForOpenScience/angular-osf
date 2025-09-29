import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContributorModel } from '@shared/models';

@Component({
  selector: 'osf-contributors-list',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './contributors-list.component.html',
  styleUrl: './contributors-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsListComponent {
  contributors = input.required<ContributorModel[] | Partial<ContributorModel>[]>();
  readonly = input<boolean>(false);
  anonymous = input<boolean>(false);
}
