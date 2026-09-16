import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node';

import { inspectSsrHtml, shouldInspectHtml } from './ssr-html-metrics';
import { sendSsrMetrics } from './ssr-metrics';
import { SsrServerEnvironment } from './ssr-server-config';

import { NextFunction, Request, Response as ExpressResponse } from 'express';

const SEARCH_BOT =
  /bot|crawler|spider|robot|crawling|googlebot|bingbot|yandex|baidu|duckduckbot|facebookexternalhit|facebot|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|pinterest|embedly|meta-externalagent/i;

const isSearchBot = (userAgent: string) => SEARCH_BOT.test(userAgent);

const isNonMetricsRequest = (path: string) => {
  const pathname = path.split('?')[0];

  return (
    /^\/(?:static|assets)(?:\/|$)/.test(pathname) ||
    /^\/\.well-known(?:\/|$)/.test(pathname) ||
    /\.(?:json|ico|js|css|mjs|map|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|txt|xml)$/i.test(pathname)
  );
};

const buildMetricUrl = (originalUrl: string, webUrl: string) => {
  const pathname = originalUrl.split('?')[0];
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (!webUrl) return path;

  return `${webUrl.replace(/\/$/, '')}${path}`;
};

const queueSsrMetrics = (
  config: SsrServerEnvironment,
  req: Request,
  userAgent: string,
  isBot: boolean,
  ttfb: number,
  status: number,
  inspectHtml: boolean,
  response?: globalThis.Response | null
) => {
  setImmediate(async () => {
    try {
      let isComplete = false;
      let contentType: string | null = null;

      if (inspectHtml && response) {
        const html = await response.text();
        const inspection = inspectSsrHtml(html, req.path);
        isComplete = inspection.isComplete;
        contentType = inspection.contentType;
      }

      await sendSsrMetrics(config, {
        url: buildMetricUrl(req.originalUrl, config.webUrl),
        ttfb: Math.round(ttfb),
        is_bot: isBot,
        is_complete: isComplete,
        content_type: contentType,
        status,
        user_agent: userAgent,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
};

export const createSsrMetricsMiddleware =
  (angularApp: AngularNodeAppEngine, config: SsrServerEnvironment) =>
  (req: Request, res: ExpressResponse, next: NextFunction) => {
    const startTime = performance.now();
    const userAgent = req.headers['user-agent'] || '';
    const bot = isSearchBot(userAgent);

    if (isNonMetricsRequest(req.path)) {
      return angularApp
        .handle(req)
        .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
    }

    return angularApp
      .handle(req)
      .then((response) => {
        if (!response) {
          queueSsrMetrics(config, req, userAgent, bot, performance.now() - startTime, 0, false);
          return next();
        }

        const ttfb = performance.now() - startTime;
        const inspectHtml = shouldInspectHtml(bot, response.status);

        queueSsrMetrics(config, req, userAgent, bot, ttfb, response.status, inspectHtml, response);
        return writeResponseToNodeResponse(inspectHtml ? response.clone() : response, res);
      })
      .catch((err) => {
        queueSsrMetrics(config, req, userAgent, bot, performance.now() - startTime, 500, false);
        next(err);
      });
  };
