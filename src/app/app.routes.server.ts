import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'terms-of-use',
    renderMode: RenderMode.Server,
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Server,
  },
  {
    path: 'forbidden',
    renderMode: RenderMode.Server,
  },
  {
    path: 'request-access/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'not-found',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preprints/:providerId/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-projects',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-registrations',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-preprints',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'settings/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':id/overview',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
