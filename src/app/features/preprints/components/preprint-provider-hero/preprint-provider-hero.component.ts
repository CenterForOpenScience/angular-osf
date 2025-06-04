import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { SearchInputComponent } from '@shared/components';
import { ResourceTab } from '@shared/enums';

@Component({
  selector: 'osf-preprint-provider-hero',
  imports: [Button, RouterLink, SearchInputComponent, Skeleton, TranslatePipe],
  templateUrl: './preprint-provider-hero.component.html',
  styleUrl: './preprint-provider-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderHeroComponent {
  private readonly router = inject(Router);
  preprintProvider = input.required<PreprintProviderDetails | undefined>();
  isPreprintProviderLoading = input.required<boolean>();
  addPreprintClicked = output<void>();

  protected searchControl = new FormControl<string>('');

  addPreprint() {
    this.addPreprintClicked.emit();
  }

  redirectToDiscoverPageWithValue() {
    const searchValue = this.searchControl.value;

    this.router.navigate(['/discover'], {
      queryParams: { search: searchValue, resourceTab: ResourceTab.Preprints },
    });
  }
}
