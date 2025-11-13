import { inject, Injectable } from '@angular/core';

import { WINDOW } from '../provider/window.provider';

@Injectable({
  providedIn: 'root',
})
export class PrerenderReadyService {
  private readonly window = inject(WINDOW);

  setNotReady(): void {
    if (this.window && 'prerenderReady' in this.window) {
      this.window.prerenderReady = false;
    }
  }

  setReady(): void {
    if (this.window && 'prerenderReady' in this.window) {
      this.window.prerenderReady = true;
    }
  }
}
