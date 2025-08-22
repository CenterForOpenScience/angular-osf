import { provideStates } from '@ngxs/store';

import { Routes } from '@angular/router';

import { MeetingsState } from './store/meetings.state';
import { MeetingsComponent } from './meetings.component';

export const meetingsRoutes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    providers: [provideStates([MeetingsState])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@osf/features/meetings/pages/meetings-landing/meetings-landing.component').then(
            (mod) => mod.MeetingsLandingComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@osf/features/meetings/pages/meeting-details/meeting-details.component').then(
            (mod) => mod.MeetingDetailsComponent
          ),
      },
    ],
  },
];
