import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const isBot = (ua: string) => /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use('/**', (req, res, next) => {
  const startTime = performance.now();
  const userAgent = req.headers['user-agent'] || '';
  const isSearchBot = isBot(userAgent);
  const url = req.originalUrl;

  const isStaticFile = url.includes('/static/') || url.includes('/assets/');
  const isSystemFile = url.includes('.well-known') || url.endsWith('.json') || url.endsWith('.ico');

  if (isStaticFile || isSystemFile) {
    return angularApp
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  }

  return angularApp
    .handle(req)
    .then((response) => {
      if (!response) return next();

      const ttfb = performance.now() - startTime;

      const responseForUser = response.clone();
      writeResponseToNodeResponse(responseForUser, res);

      setImmediate(async () => {
        try {
          let isComplete = true;

          const shouldSample = isSearchBot || Math.random() < 0.05;

          if (shouldSample && response.status === 200) {
            const html = await response.text();

            const hasTitle = html.includes('<title');
            const hasAppRootClosed = html.includes('</osf-root>');
            const isEmptyApp = html.includes('<osf-root></osf-root>');
            isComplete = hasTitle && hasAppRootClosed && !isEmptyApp;
          }

          const body = {
            url: req.originalUrl,
            status: response.status,
            ttfb: Math.round(ttfb),
            isBot: isSearchBot,
            isComplete: isComplete,
            timestamp: new Date().toISOString(),
          };

          // eslint-disable-next-line no-console
          console.log(body);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      });
    })
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
