import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

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

  readonly isBaseRoute = toSignal(this.router.events.pipe(map(() => this.router.url === '/settings/tokens')), {
    initialValue: this.router.url === '/settings/tokens',
  });

  ngOnInit() {
    this.actions.getScopes();
  }

  createToken(): void {
    this.customDialogService.open(TokenAddEditFormComponent, {
      header: 'settings.tokens.form.createTitle',
      width: '800px',
    });
  }
}
