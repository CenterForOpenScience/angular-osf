import { Store } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { map } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { GetScopes } from '@osf/features/settings/tokens/store';
import { TokenAddEditFormComponent } from '@osf/features/settings/tokens/token-add-edit-form/token-add-edit-form.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-tokens',
  imports: [SubHeaderComponent, RouterOutlet],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensComponent implements OnInit {
  #dialogService = inject(DialogService);
  #isXSmall$ = inject(IS_XSMALL);
  #isMedium$ = inject(IS_MEDIUM);
  #store = inject(Store);
  #router = inject(Router);

  protected readonly isXSmall = toSignal(this.#isXSmall$);
  protected readonly isMedium = toSignal(this.#isMedium$);
  protected readonly isBaseRoute = toSignal(
    this.#router.events.pipe(
      map(() => this.#router.url === '/settings/tokens'),
    ),
    { initialValue: this.#router.url === '/settings/tokens' },
  );

  createToken(): void {
    let dialogWidth = '850px';
    if (this.isXSmall()) {
      dialogWidth = '345px';
    } else if (this.isMedium()) {
      dialogWidth = '500px';
    }

    this.#dialogService.open(TokenAddEditFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: 'Create Personal Access Token',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  ngOnInit() {
    this.#store.dispatch(GetScopes);
  }
}
