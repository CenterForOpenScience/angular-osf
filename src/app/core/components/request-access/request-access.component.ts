import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';

import { finalize, map } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AuthService } from '@core/services/auth.service';
import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { LoaderService } from '@osf/shared/services/loader.service';
import { RequestAccessService } from '@osf/shared/services/request-access.service';
import { ToastService } from '@osf/shared/services/toast.service';

@Component({
  selector: 'osf-request-access',
  imports: [TranslatePipe, Button, Textarea, FormsModule],
  templateUrl: './request-access.component.html',
  styleUrl: './request-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestAccessComponent {
  comment = model('');

  private readonly environment = inject(ENVIRONMENT);
  readonly supportEmail = this.environment.supportEmail;
  readonly commentLimit = InputLimits.requestAccessComment.maxLength;

  private readonly route = inject(ActivatedRoute);
  private readonly id = toSignal(this.route.params.pipe(map((params) => params['id'])));

  private readonly router = inject(Router);
  private readonly requestAccessService = inject(RequestAccessService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  readonly isProjectReadOnly = select(UserSelectors.isProjectReadOnly);

  readonly titleTranslation = computed(() =>
    this.isProjectReadOnly() ? 'requestAccess.readOnlyTitle' : 'requestAccess.title'
  );

  readonly messageTranslation = computed(() =>
    this.isProjectReadOnly() ? 'requestAccess.messageReadOnly' : 'requestAccess.message'
  );

  requestAccess() {
    const id = this.id();
    if (!id) {
      return;
    }

    this.loaderService.show();
    this.requestAccessService
      .requestAccessToProject(id, this.comment())
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('requestAccess.requestedSuccessMessage');
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.toastService.showError('requestAccess.alreadyRequestedMessage');
          }
        },
      });
  }

  switchAccount() {
    this.authService.logout();
  }
}
