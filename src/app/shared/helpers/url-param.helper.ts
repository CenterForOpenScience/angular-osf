export const urlParam = (params: Record<string, string>) => {
  return Object.entries(params)
    .map((entry) => entry.map((comp) => encodeURIComponent(comp)).join('='))
    .join('&');
};

export const localUrlParam = (params: { service: string; next?: string }): string => {
  const { service, next } = params;

  if (!next) {
    return `service=${encodeURIComponent(service)}`;
  }

  const encodedNext = encodeURIComponent(next);
  const valueAfterService = `${service}?next=${encodedNext}`;
  return `service=${encodeURIComponent(valueAfterService)}`;
};
