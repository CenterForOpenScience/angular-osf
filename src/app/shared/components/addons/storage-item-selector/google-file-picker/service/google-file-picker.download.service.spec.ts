import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { GoogleFilePickerDownloadService } from './google-file-picker.download.service';

describe('Service: Google File Picker Download', () => {
  let service: GoogleFilePickerDownloadService;
  let mockDocument: Document;
  let mockScriptElement: any;

  beforeEach(() => {
    mockScriptElement = {
      set src(url) {
        this._src = url;
      },
      get src() {
        return this._src;
      },
      onload: jest.fn(),
      onerror: jest.fn(),
    };

    mockDocument = {
      createElement: jest.fn(() => mockScriptElement),
      body: {
        appendChild: jest.fn((node: Node) => node),
      } as any,
      querySelector: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [GoogleFilePickerDownloadService, { provide: DOCUMENT, useValue: mockDocument }],
    });

    service = TestBed.inject(GoogleFilePickerDownloadService);
  });

  it('should load the script and complete the observable', (done) => {
    const observable = service.loadScript();

    observable.subscribe({
      next: () => {
        expect(mockDocument.createElement).toHaveBeenCalledWith('script');
        expect(mockScriptElement.src).toBe('https://apis.google.com/js/api.js');
        expect(mockScriptElement.async).toBeTruthy();
        expect(mockScriptElement.defer).toBeTruthy();
        expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockScriptElement);
      },
      complete: () => {
        expect(true).toBe(true);
        done();
      },
      error: () => {
        fail('Should not call error on script load success');
      },
    });

    mockScriptElement.onload();
  });

  it('should emit error when script fails to load', (done) => {
    const mockScriptElement: Partial<HTMLScriptElement> = {};

    // Mock document
    const mockDocument = {
      createElement: jest.fn(() => mockScriptElement),
      body: {
        appendChild: jest.fn(() => {
          // Simulate async error after appendChild
          setTimeout(() => {
            mockScriptElement.onerror?.(new Event('error'));
          }, 0);
        }),
      },
      querySelector: jest.fn(() => null),
    };

    // Re-instantiate service with mocked document
    const service = new GoogleFilePickerDownloadService(mockDocument as unknown as Document);

    service.loadScript().subscribe({
      next: () => fail('Should not emit next on error'),
      error: (err) => {
        expect(err).toBe('Failed to load Google Picker script');
        done();
      },
    });
  });

  describe('loadGapiModules', () => {
    beforeEach(() => {
      // Mock window.gapi
      (globalThis as any).gapi = {
        load: jest.fn(),
      };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should complete when GAPI loads successfully', (done) => {
      service.loadGapiModules().subscribe({
        next: () => {},
        complete: () => {
          expect(globalThis.gapi.load).toHaveBeenCalledWith(
            'client:picker',
            expect.objectContaining({
              callback: expect.any(Function),
              onerror: expect.any(Function),
              timeout: 5000,
              ontimeout: expect.any(Function),
            })
          );
          done();
        },
        error: () => fail('Should not error'),
      });

      const config = (globalThis.gapi.load as jest.Mock).mock.calls[0][1];
      config.callback(); // simulate success
    });

    it('should emit error when GAPI fails to load', (done) => {
      service.loadGapiModules().subscribe({
        next: () => fail('Should not emit next'),
        error: (err) => {
          expect(err).toBe('Failed to load GAPI modules');
          done();
        },
      });

      const config = (globalThis.gapi.load as jest.Mock).mock.calls[0][1];
      config.onerror(); // simulate failure
    });

    it('should emit error on GAPI timeout', (done) => {
      service.loadGapiModules().subscribe({
        next: () => fail('Should not emit next'),
        error: (err) => {
          expect(err).toBe('GAPI load timeout');
          done();
        },
      });

      const config = (globalThis.gapi.load as jest.Mock).mock.calls[0][1];
      config.ontimeout(); // simulate timeout
    });
  });
});
