import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { RadioButton } from 'primeng/radiobutton';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { LoaderService, ToastService } from '@osf/shared/services';

import { UpdateIndexing } from '../../store';

@Component({
  selector: 'osf-share-indexing',
  imports: [Button, Card, RadioButton, ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './share-indexing.component.html',
  styleUrl: './share-indexing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareIndexingComponent {
  private readonly actions = createDispatchMap({ updateIndexing: UpdateIndexing });
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  private readonly indexing = select(UserSelectors.getShareIndexing);
  readonly currentUser = select(UserSelectors.getCurrentUser);

  selectedOption = this.indexing();

  get noChanges() {
    return this.selectedOption === this.indexing();
  }

  updateIndexing() {
    if (this.selectedOption === this.indexing()) {
      return;
    }

    if (this.currentUser()?.id && this.selectedOption !== undefined) {
      this.loaderService.show();
      this.actions
        .updateIndexing(this.selectedOption)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe(() => this.toastService.showSuccess('settings.accountSettings.shareIndexing.successUpdate'));
    }
  }
}
