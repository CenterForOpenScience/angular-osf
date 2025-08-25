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
        appendChild: jest.fn(),
      },
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
    service.loadScript().subscribe({
      next: () => fail('Should not emit next on error'),
      error: (err) => {
        expect(err).toBe('Failed to load Google Picker script');
        done();
      },
    });

    mockScriptElement.onerror();
  });
});
