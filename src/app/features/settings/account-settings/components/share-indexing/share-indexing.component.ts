import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user/user.selectors';
import { ShareIndexingEnum } from '@osf/features/settings/account-settings/components/share-indexing/enums/share-indexing.enum';
import { UpdateIndexing } from '@osf/features/settings/account-settings/store/account-settings.actions';

@Component({
  selector: 'osf-share-indexing',
  imports: [Button, RadioButton, ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './share-indexing.component.html',
  styleUrl: './share-indexing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareIndexingComponent {
  readonly #store = inject(Store);
  protected indexing = signal<ShareIndexingEnum>(ShareIndexingEnum.None);
  protected readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  updateIndexing = () => {
    if (this.currentUser()?.id) {
      if (this.indexing() === ShareIndexingEnum.OptIn) {
        this.#store.dispatch(new UpdateIndexing(true));
      } else if (this.indexing() === ShareIndexingEnum.OutOf) {
        this.#store.dispatch(new UpdateIndexing(false));
      }
    }
  };

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user?.allowIndexing) {
        this.indexing.set(ShareIndexingEnum.OptIn);
      } else if (user?.allowIndexing === false) {
        this.indexing.set(ShareIndexingEnum.OutOf);
      }
    });
  }
}
