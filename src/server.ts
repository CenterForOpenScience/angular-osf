import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule } from '@angular/ssr/node';

import { createSsrMetricsMiddleware } from './server/ssr-metrics.middleware';
import { loadSsrServerConfig } from './server/ssr-server-config';
import { setStaticCacheHeaders } from './server/static-cache-headers';

import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const configPath = resolve(browserDistFolder, 'assets/config/config.json');

const app = express();
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: ['x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-prefix'],
});
const serverConfig = loadSsrServerConfig(configPath);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: setStaticCacheHeaders,
  })
);

app.use(createSsrMetricsMiddleware(angularApp, serverConfig));

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
