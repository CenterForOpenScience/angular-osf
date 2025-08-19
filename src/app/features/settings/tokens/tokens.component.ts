import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { IS_SMALL } from '@osf/shared/helpers';

import { TokenAddEditFormComponent } from './components';
import { GetScopes } from './store';

@Component({
  selector: 'osf-tokens',
  imports: [SubHeaderComponent, RouterOutlet, TranslatePipe],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly actions = createDispatchMap({ getScopes: GetScopes });

  protected readonly isSmall = toSignal(inject(IS_SMALL));
  protected readonly isBaseRoute = toSignal(
    this.router.events.pipe(map(() => this.router.url === '/settings/tokens')),
    { initialValue: this.router.url === '/settings/tokens' }
  );

  ngOnInit() {
    this.actions.getScopes();
  }

  createToken(): void {
    const dialogWidth = this.isSmall() ? '800px ' : '95vw';

    this.dialogService.open(TokenAddEditFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('settings.tokens.form.createTitle'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
