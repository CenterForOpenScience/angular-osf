import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { TokenAddEditFormComponent } from '@osf/features/settings/tokens/token-add-edit-form/token-add-edit-form.component';
import { RouterOutlet, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetScopes } from '@osf/features/settings/tokens/store';
import { map } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'osf-tokens',
  standalone: true,
  imports: [SubHeaderComponent, RouterOutlet, TranslatePipe],
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
  #translateService = inject(TranslateService);

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
      header: this.#translateService.instant(
        'settings.tokens.form.createTitle',
      ),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  ngOnInit() {
    this.#store.dispatch(GetScopes);
  }
}
