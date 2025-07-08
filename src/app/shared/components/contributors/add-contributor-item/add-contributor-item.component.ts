import { TranslatePipe } from '@ngx-translate/core';

import { Checkbox } from 'primeng/checkbox';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PERMISSION_OPTIONS } from '@osf/shared/constants';
import { ContributorAddModel } from '@osf/shared/models';

@Component({
  selector: 'osf-add-contributor-item',
  imports: [Checkbox, Select, FormsModule, TranslatePipe],
  templateUrl: './add-contributor-item.component.html',
  styleUrl: './add-contributor-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddContributorItemComponent {
  contributor = input.required<ContributorAddModel>();

  protected readonly permissionsOptions = PERMISSION_OPTIONS;
}
