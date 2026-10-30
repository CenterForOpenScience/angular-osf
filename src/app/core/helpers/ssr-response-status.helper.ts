export const isServerError = (status: number): boolean => status >= 500 && status < 600;

const isResourceHttpStatus = (status: number): boolean =>
  status === 401 || status === 403 || status === 404 || status === 410;

const toSsrHttpStatus = (status: number): number => (status === 0 ? 503 : status);

export function setSsrResponseStatus(responseInit: ResponseInit | null, status: number): void {
  if (!responseInit) {
    return;
  }

  const next = toSsrHttpStatus(status);
  const current = responseInit.status;

  if (!current || current === 200 || (isServerError(current) && isResourceHttpStatus(next))) {
    responseInit.status = next;
  }
}

export function shouldPropagateHttpStatusToSsr(status: number): boolean {
  return status === 0 || isResourceHttpStatus(status) || isServerError(status);
}
