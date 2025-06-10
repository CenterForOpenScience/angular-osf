import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestAccessService } from '@osf/core/services';
import { InputLimits } from '@osf/shared/constants';
import { LoaderService, ToastService } from '@osf/shared/services';

@Component({
  selector: 'osf-request-access',
  imports: [TranslatePipe, Button, Textarea, FormsModule],
  templateUrl: './request-access.component.html',
  styleUrl: './request-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestAccessComponent {
  commentLimit = InputLimits.requestAccessComment.maxLength;
  comment = model('');

  private readonly route = inject(ActivatedRoute);
  private readonly projectId = toSignal(this.route?.params.pipe(map((params) => params['projectId'])) ?? of(undefined));

  private readonly requestAccessService = inject(RequestAccessService);
  private readonly router = inject(Router);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  requestAccess() {
    this.loaderService.show();
    this.requestAccessService.requestAccessToProject(this.projectId(), this.comment()).subscribe(() => {
      this.loaderService.hide();
      this.router.navigate(['/']);
      this.toastService.showSuccess('requestAccess.requestedSuccessMessage');
    });
  }

  switchAccount() {
    // [NS] TODO: add logout logic when the user is logged in
  }
}
