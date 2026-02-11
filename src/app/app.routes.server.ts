import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'terms-of-use',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'forbidden',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'not-found',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'forgotpassword',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '',
    renderMode: RenderMode.Prerender,
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
    path: 'register',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'registries/drafts/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'registries/revisions/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'settings/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'request-access/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'resetpassword/:userId/:token',
    renderMode: RenderMode.Server,
  },
  {
    path: 'search',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preprints/discover',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preprints/:providerId/:id/pending-moderation',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preprints/:providerId/discover',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preprints/:providerId/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preprints/:providerId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'registries/discover',
    renderMode: RenderMode.Server,
  },
  {
    path: 'registries/:providerId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'institutions',
    renderMode: RenderMode.Server,
  },
  {
    path: 'institutions/:institutionId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'collections/:providerId/discover',
    renderMode: RenderMode.Server,
  },
  {
    path: 'meetings/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'user/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'project/:id/node/:nodeId/files/:provider/:fileId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'project/:id/files/:provider/:fileId',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/files/:provider/:fileId',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/overview',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/metadata/:recordId',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/files/**',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/registrations',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/analytics',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/links',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/resources',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/components',
    renderMode: RenderMode.Server,
  },
  {
    path: ':id/recent-activity',
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
