export const urlParam = (params: Record<string, string>) => {
  return Object.entries(params)
    .map((entry) => entry.map((comp) => encodeURIComponent(comp)).join('='))
    .join('&');
};
