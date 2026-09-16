import { SsrMetricAttributes, SsrMetricsPayload } from './ssr-metrics.model';
import { SsrServerEnvironment } from './ssr-server-config';

const MAX_USER_AGENT_LENGTH = 512;

const truncateUserAgent = (userAgent: string) =>
  userAgent.length <= MAX_USER_AGENT_LENGTH ? userAgent : userAgent.slice(0, MAX_USER_AGENT_LENGTH);

export const sendSsrMetrics = async (config: SsrServerEnvironment, attributes: SsrMetricAttributes) => {
  if (!config.apiDomainUrl) return;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.api+json;version=2.20',
    'Content-Type': 'application/vnd.api+json',
  };

  if (config.throttleToken) {
    headers['X-Throttle-Token'] = config.throttleToken;
  }

  const payload: SsrMetricsPayload = {
    data: {
      attributes: {
        ...attributes,
        user_agent: truncateUserAgent(attributes.user_agent),
      },
    },
  };

  const response = await fetch(`${config.apiDomainUrl}/_/metrics/events/ssr_metrics/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`SSR metrics request failed with status ${response.status}`);
  }
};
