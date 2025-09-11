import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CustomConfirmationService } from './custom-confirmation.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectRedirectDialogService {
  private readonly confirmationService = inject(CustomConfirmationService);
  private readonly router = inject(Router);

  showProjectRedirectDialog(projectId: string): void {
    this.confirmationService.confirmAccept({
      headerKey: 'myProjects.redirectDialog.header',
      messageKey: 'myProjects.redirectDialog.message',
      acceptLabelKey: 'myProjects.redirectDialog.confirmButton',
      rejectLabelKey: 'myProjects.redirectDialog.rejectButton',
      onConfirm: () => this.router.navigate(['/', projectId]),
      onReject: () => null,
    });
  }
}
