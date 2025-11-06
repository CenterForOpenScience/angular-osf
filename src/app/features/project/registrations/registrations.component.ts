import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { GetRegistrations, RegistrationsSelectors } from './store';

@Component({
  selector: 'osf-registrations',
  imports: [
    RegistrationCardComponent,
    SubHeaderComponent,
    FormsModule,
    TranslatePipe,
    LoadingSpinnerComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly environment = inject(ENVIRONMENT);

  readonly hasAdminAccess = select(CurrentResourceSelectors.hasAdminAccess);
  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  registrations = select(RegistrationsSelectors.getRegistrations);
  registrationsTotalCount = select(RegistrationsSelectors.getRegistrationsTotalCount);
  isRegistrationsLoading = select(RegistrationsSelectors.isRegistrationsLoading);
  actions = createDispatchMap({ getRegistrations: GetRegistrations });

  itemsPerPage = 10;
  first = 0;

  ngOnInit(): void {
    this.actions.getRegistrations(this.projectId(), 1, this.itemsPerPage);
  }

  addRegistration(): void {
    this.router.navigate([`registries/${this.environment.defaultProvider}/new`], {
      queryParams: { projectId: this.projectId() },
    });
  }

  onPageChange(event: PaginatorState): void {
    this.actions.getRegistrations(this.projectId(), event.page! + 1, this.itemsPerPage);
    this.first = event.first!;
  }
}
