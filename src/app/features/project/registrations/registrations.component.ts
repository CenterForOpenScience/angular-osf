import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';

import { GetRegistrations, RegistrationsSelectors } from './store';

@Component({
  selector: 'osf-registrations',
  imports: [RegistrationCardComponent, SubHeaderComponent, FormsModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  protected registrations = select(RegistrationsSelectors.getRegistrations);
  protected isRegistrationsLoading = select(RegistrationsSelectors.isRegistrationsLoading);
  protected actions = createDispatchMap({ getRegistrations: GetRegistrations });
  private readonly OSF_PROVIDER_ID = 'osf';

  ngOnInit(): void {
    this.actions.getRegistrations(this.projectId());
  }

  addRegistration(): void {
    this.router.navigate([`registries/${this.OSF_PROVIDER_ID}/new`], {
      queryParams: { projectId: this.projectId() },
    });
  }
}
