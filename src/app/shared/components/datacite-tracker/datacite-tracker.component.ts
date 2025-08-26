import { Component, effect, inject } from '@angular/core';

import { DataciteService } from '@shared/services/datacite.service';

@Component({
  template: ``,
})
export abstract class DataciteTrackerComponent {
  private isLogged = false;
  private dataciteService = inject(DataciteService);

  protected constructor() {
    this.setupDataciteViewTrackerEffect();
  }
  protected abstract getDoi(): string | null;

  protected setupDataciteViewTrackerEffect() {
    effect(() => {
      const doi = this.getDoi();
      if (doi && !this.isLogged) {
        this.isLogged = true;
        this.dataciteService.logView(doi);
      }
    });
  }
}
