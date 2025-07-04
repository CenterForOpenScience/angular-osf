import { TranslatePipe } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';

import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { ADDON_TERMS as addonTerms } from '@shared/constants';
import { Addon, AddonTerm, AuthorizedAddon } from '@shared/models';
import { isCitationAddon } from '@shared/utils';

@Component({
  selector: 'osf-addon-terms',
  imports: [TranslatePipe, TableModule, NgClass],
  templateUrl: './addon-terms.component.html',
  styleUrls: ['./addon-terms.component.scss'],
})
export class AddonTermsComponent {
  addon = input<Addon | AuthorizedAddon | null>(null);
  protected terms = computed(() => {
    const addon = this.addon();
    if (!addon) {
      return [];
    }
    return this.getAddonTerms(addon);
  });

  private getAddonTerms(addon: Addon | AuthorizedAddon): AddonTerm[] {
    const supportedFeatures = addon.supportedFeatures;
    const provider = addon.providerName;
    const isCitationService = isCitationAddon(addon);

    const relevantTerms = isCitationService ? addonTerms.filter((term) => term.citation) : addonTerms;

    return relevantTerms.map((term) => {
      const feature = term.supportedFeature;
      const hasFeature = supportedFeatures.includes(feature);
      const hasPartialFeature = supportedFeatures.includes(`${feature}_PARTIAL`);

      let message: string;
      let type: 'warning' | 'info' | 'danger';

      if (isCitationService && term.citation) {
        if (hasPartialFeature && term.citation.partial) {
          message = term.citation.partial;
          type = 'warning';
        } else if (!hasFeature && term.citation.false) {
          message = term.citation.false;
          type = 'danger';
        } else {
          message = term.storage[hasFeature ? 'true' : 'false'];
          type = hasFeature ? 'info' : 'danger';
        }
      } else {
        message = term.storage[hasFeature ? 'true' : 'false'];
        type = hasFeature ? 'info' : hasPartialFeature ? 'warning' : 'danger';
      }

      return {
        function: term.label,
        status: message.replace(/{provider}/g, provider),
        type,
      };
    });
  }
}
