import { setSsrResponseStatus, shouldPropagateHttpStatusToSsr } from './ssr-response-status.helper';

describe('ssr-response-status.helper', () => {
  it('should propagate 0, 401, 403, 404, 410, and 5xx statuses', () => {
    expect(shouldPropagateHttpStatusToSsr(0)).toBe(true);
    expect(shouldPropagateHttpStatusToSsr(401)).toBe(true);
    expect(shouldPropagateHttpStatusToSsr(403)).toBe(true);
    expect(shouldPropagateHttpStatusToSsr(404)).toBe(true);
    expect(shouldPropagateHttpStatusToSsr(410)).toBe(true);
    expect(shouldPropagateHttpStatusToSsr(500)).toBe(true);
    expect(shouldPropagateHttpStatusToSsr(503)).toBe(true);
  });

  it('should not propagate 409 or other 4xx statuses', () => {
    expect(shouldPropagateHttpStatusToSsr(409)).toBe(false);
    expect(shouldPropagateHttpStatusToSsr(422)).toBe(false);
  });

  it('should set status when response init is available and unset', () => {
    const responseInit: ResponseInit = {};
    setSsrResponseStatus(responseInit, 404);
    expect(responseInit.status).toBe(404);
  });

  it('should map network status 0 to 503', () => {
    const responseInit: ResponseInit = {};
    setSsrResponseStatus(responseInit, 0);
    expect(responseInit.status).toBe(503);
  });

  it('should keep an existing non-OK status when the next status is 5xx', () => {
    const responseInit: ResponseInit = { status: 404 };
    setSsrResponseStatus(responseInit, 500);
    expect(responseInit.status).toBe(404);
  });

  it('should replace an earlier 5xx with a later resource status', () => {
    const responseInit: ResponseInit = { status: 503 };
    setSsrResponseStatus(responseInit, 404);
    expect(responseInit.status).toBe(404);
  });

  it('should no-op when response init is missing', () => {
    expect(() => setSsrResponseStatus(null, 404)).not.toThrow();
  });
});
