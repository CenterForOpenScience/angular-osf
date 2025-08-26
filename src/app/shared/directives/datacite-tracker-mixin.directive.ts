import { Component, effect, inject } from '@angular/core';

import { DataciteService } from '@shared/services/datacite.service';

@Component({
  template: ``,
})
export abstract class DataciteTrackerComponent {
  private logged = false;
  private dataciteService = inject(DataciteService);

  protected constructor() {
    this.setupTrackerEffect();
  }
  protected abstract getDoi(): string | null;

  protected setupTrackerEffect() {
    effect(() => {
      const doi = this.getDoi();
      if (doi && !this.isLogged) {
        this.isLogged = true;
        this.dataciteService.logView(doi);
      }
    });
  }
}
