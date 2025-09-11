import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CustomPaginatorComponent,
  LoadingSpinnerComponent,
  RegistrationCardComponent,
  SubHeaderComponent,
} from '@osf/shared/components';

import { GetRegistrations, RegistrationsSelectors } from './store';

import { environment } from 'src/environments/environment';

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
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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
    this.router.navigate([`registries/${environment.defaultProvider}/new`], {
      queryParams: { projectId: this.projectId() },
    });
  }

  onPageChange(event: PaginatorState): void {
    this.actions.getRegistrations(this.projectId(), event.page! + 1, this.itemsPerPage);
    this.first = event.first!;
  }
}
