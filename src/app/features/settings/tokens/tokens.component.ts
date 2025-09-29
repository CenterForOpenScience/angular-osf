import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { IS_SMALL } from '@osf/shared/helpers';
import { CustomDialogService } from '@osf/shared/services';

import { TokenAddEditFormComponent } from './components';
import { GetScopes } from './store';

@Component({
  selector: 'osf-tokens',
  imports: [SubHeaderComponent, RouterOutlet, TranslatePipe],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensComponent implements OnInit {
  private readonly customDialogService = inject(CustomDialogService);
  private readonly router = inject(Router);
  private readonly actions = createDispatchMap({ getScopes: GetScopes });

  readonly isSmall = toSignal(inject(IS_SMALL));
  readonly isBaseRoute = toSignal(this.router.events.pipe(map(() => this.router.url === '/settings/tokens')), {
    initialValue: this.router.url === '/settings/tokens',
  });

  ngOnInit() {
    this.actions.getScopes();
  }

  createToken(): void {
    const dialogWidth = this.isSmall() ? '800px ' : '95vw';

    this.customDialogService.open(TokenAddEditFormComponent, {
      header: 'settings.tokens.form.createTitle',
      width: dialogWidth,
    });
  }
}
