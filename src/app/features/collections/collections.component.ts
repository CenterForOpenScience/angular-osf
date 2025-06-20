import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CollectionsHelpDialogComponent, CollectionsMainContentComponent } from '@osf/features/collections/components';
import { CollectionsSelectors, GetCollectionProvider } from '@osf/features/collections/store';
import { LoadingSpinnerComponent, SearchInputComponent } from '@shared/components';

@Component({
  selector: 'osf-collections',
  imports: [SearchInputComponent, TranslatePipe, Button, CollectionsMainContentComponent, LoadingSpinnerComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  protected searchControl = new FormControl('');
  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected providerId = signal<string>('');
  protected actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
  });
  protected isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.providerId.set(id);
      this.actions.getCollectionProvider(id);
    } else {
      this.router.navigate(['/not-found']);
    }

    effect(() => {
      console.log(this.collectionProvider());
    });
  }

  openHelpDialog() {
    this.dialogService.open(CollectionsHelpDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant('collections.helpDialog.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
