export interface SsrMetricAttributes {
  url: string;
  ttfb: number;
  is_bot: boolean;
  is_complete: boolean;
  content_type: string | null;
  status: number;
  user_agent: string;
}

export interface SsrMetricsPayload {
  data: {
    attributes: SsrMetricAttributes;
  };
}

export interface SsrHtmlInspection {
  isComplete: boolean;
  contentType: string | null;
}
