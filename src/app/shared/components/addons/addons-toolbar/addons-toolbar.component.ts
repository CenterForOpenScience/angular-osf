import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, effect, inject, input, model, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SelectOption } from '@osf/shared/models/select-option.model';
import { AddonsQueryParamsService } from '@osf/shared/services/addons-query-params.service';

import { SearchInputComponent } from '../../search-input/search-input.component';
import { SelectComponent } from '../../select/select.component';

@Component({
  selector: 'osf-addons-toolbar',
  imports: [SearchInputComponent, SelectComponent, FormsModule, TranslatePipe],
  templateUrl: './addons-toolbar.component.html',
  styleUrl: './addons-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsToolbarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private queryParamsService = inject(AddonsQueryParamsService);

  categoryOptions = input.required<SelectOption[]>();
  searchControl = input.required<FormControl<string | null>>();
  selectedCategory = model.required<string>();

  constructor() {
    effect(() => {
      const addonType = this.selectedCategory();
      this.queryParamsService.updateQueryParams(this.route, { addonType });
    });
  }

  ngOnInit(): void {
    const params = this.queryParamsService.readQueryParams(this.route);

    if (params.addonType) {
      this.selectedCategory.set(params.addonType);
    }
  }
}
