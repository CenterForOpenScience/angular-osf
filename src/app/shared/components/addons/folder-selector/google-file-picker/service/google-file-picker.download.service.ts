import { Observable, Subscriber } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Injectable service to load the Google Picker API script dynamically.
 *
 * This service ensures the script is only loaded once and provides an observable
 * to notify subscribers when loading is complete or fails.
 */
@Injectable({ providedIn: 'root' })
export class GoogleFilePickerDownloadService {
  /** Tracks whether the script has already been loaded to prevent duplicates. */
  private scriptLoaded = false;
  /** The Google Picker API script URL. */
  private scriptUrl = 'https://apis.google.com/js/api.js';

  /**
   * Constructor injecting the global `Document` object.
   *
   * @param document - The Angular-injected reference to the global `document`.
   */
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Dynamically loads the Google Picker script if it hasn't already been loaded.
   *
   * Returns an Observable that completes when the script is successfully loaded.
   * Emits an error if the script fails to load.
   *
   * @returns Observable that emits once the script is loaded, or errors if loading fails.
   */
  loadScript(): Observable<void> {
    return new Observable<void>((observer: Subscriber<void>) => {
      new Promise(() => {
        if (this.scriptLoaded) {
          observer.next();
          observer.complete();
        }

        const script = this.document.createElement('script');
        script.src = this.scriptUrl;
        script.onload = () => {
          this.scriptLoaded = true;
          observer.next();
          observer.complete();
        };
        script.onerror = () => observer.error('Failed to load Google Picker script');
        this.document.body.appendChild(script);
      });
    });
  }
}
