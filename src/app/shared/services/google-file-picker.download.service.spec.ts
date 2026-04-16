import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GoogleFilePickerDownloadService } from './google-file-picker.download.service';

describe('Service: GoogleFilePickerDownload', () => {
  let service: GoogleFilePickerDownloadService;
  let documentRef: Document;

  const setup = (platformId: 'browser' | 'server' = 'browser') => {
    TestBed.configureTestingModule({
      providers: [GoogleFilePickerDownloadService, { provide: PLATFORM_ID, useValue: platformId }],
    });

    service = TestBed.inject(GoogleFilePickerDownloadService);
    documentRef = TestBed.inject(DOCUMENT);
  };

  const removeGoogleScript = () => {
    const existing = documentRef.querySelector('script[src="https://apis.google.com/js/api.js"]');
    if (existing) {
      existing.remove();
    }
  };

  afterEach(() => {
    removeGoogleScript();
    (window as any).gapi = undefined;
  });

  it('should complete immediately when script already exists', () => {
    setup();
    const script = documentRef.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    documentRef.body.appendChild(script);
    const appendSpy = vi.spyOn(documentRef.body, 'appendChild');

    const next = vi.fn();
    const complete = vi.fn();
    service.loadScript().subscribe({ next, complete });

    expect(next).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('should append script and complete on successful load', () => {
    setup();

    const next = vi.fn();
    const complete = vi.fn();
    service.loadScript().subscribe({ next, complete });

    const script = documentRef.querySelector('script[src="https://apis.google.com/js/api.js"]') as HTMLScriptElement;
    expect(script).toBeTruthy();

    script.onload?.(new Event('load'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('should emit error when script fails to load', () => {
    setup();

    const error = vi.fn();
    service.loadScript().subscribe({ error });

    const script = documentRef.querySelector('script[src="https://apis.google.com/js/api.js"]') as HTMLScriptElement;
    expect(script).toBeTruthy();

    script.onerror?.(new Event('error'));

    expect(error).toHaveBeenCalledWith('Failed to load Google Picker script');
  });

  it('should complete immediately on second load after successful first load', () => {
    setup();
    const appendSpy = vi.spyOn(documentRef.body, 'appendChild');

    service.loadScript().subscribe();
    const script = documentRef.querySelector('script[src="https://apis.google.com/js/api.js"]') as HTMLScriptElement;
    script.onload?.(new Event('load'));
    removeGoogleScript();
    appendSpy.mockClear();

    const next = vi.fn();
    const complete = vi.fn();
    service.loadScript().subscribe({ next, complete });

    expect(next).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('should error when loading gapi modules outside browser', () => {
    setup('server');

    const error = vi.fn();
    service.loadGapiModules().subscribe({ error });

    expect(error).toHaveBeenCalledWith('GAPI not available');
  });

  it('should error when gapi is not available in browser', () => {
    setup('browser');

    const error = vi.fn();
    service.loadGapiModules().subscribe({ error });

    expect(error).toHaveBeenCalledWith('GAPI not available');
  });

  it('should load gapi modules successfully', () => {
    setup('browser');
    const loadMock = vi.fn(
      (api: string, config: { callback: () => void; onerror: () => void; timeout: number; ontimeout: () => void }) => {
        config.callback();
      }
    );
    window.gapi = { load: loadMock } as unknown as typeof window.gapi;

    const next = vi.fn();
    const complete = vi.fn();
    service.loadGapiModules().subscribe({ next, complete });

    expect(loadMock).toHaveBeenCalledWith(
      'client:picker',
      expect.objectContaining({
        timeout: 5000,
      })
    );
    expect(next).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('should emit error when gapi load fails', () => {
    setup('browser');
    const loadMock = vi.fn(
      (api: string, config: { callback: () => void; onerror: () => void; timeout: number; ontimeout: () => void }) => {
        config.onerror();
      }
    );
    window.gapi = { load: loadMock } as unknown as typeof window.gapi;

    const error = vi.fn();
    service.loadGapiModules().subscribe({ error });

    expect(error).toHaveBeenCalledWith('Failed to load GAPI modules');
  });

  it('should emit error on gapi load timeout', () => {
    setup('browser');
    const loadMock = vi.fn(
      (api: string, config: { callback: () => void; onerror: () => void; timeout: number; ontimeout: () => void }) => {
        config.ontimeout();
      }
    );
    window.gapi = { load: loadMock } as unknown as typeof window.gapi;

    const error = vi.fn();
    service.loadGapiModules().subscribe({ error });

    expect(error).toHaveBeenCalledWith('GAPI load timeout');
  });
});
