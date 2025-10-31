import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AddonTabValue } from '../enums/addon-tab.enum';
import { AddonType } from '../enums/addon-type.enum';
import { AddonCategory } from '../enums/addons-category.enum';
import { addonCategoryToQueryParam, queryParamToAddonCategory } from '../helpers/addons-query-params.helper';
import { AddonsQueryParams } from '../models/addons/addons-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class AddonsQueryParamsService {
  private router = inject(Router);

  updateQueryParams(route: ActivatedRoute, params: AddonsQueryParams): void {
    const queryParams: Record<string, string> = {};

    if (params.activeTab !== undefined) {
      queryParams['activeTab'] = params.activeTab.toString();
    }

    if (params.addonType) {
      const paramValue = addonCategoryToQueryParam(params.addonType as AddonCategory);
      if (paramValue) {
        queryParams['addonType'] = paramValue;
      }
    }

    this.router.navigate([], {
      relativeTo: route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  readQueryParams(route: ActivatedRoute): AddonsQueryParams {
    const queryParams = route.snapshot.queryParams;
    const result: AddonsQueryParams = {};

    if (queryParams['activeTab']) {
      const tabValue = Number(queryParams['activeTab']);
      if (!isNaN(tabValue) && Object.values(AddonTabValue).includes(tabValue)) {
        result.activeTab = tabValue;
      }
    }

    if (queryParams['addonType']) {
      const queryParamValue = queryParams['addonType'] as string;

      if (Object.values(AddonType).includes(queryParamValue as AddonType)) {
        result.addonType = queryParamToAddonCategory(queryParamValue as AddonType);
      } else if (Object.values(AddonCategory).includes(queryParamValue as AddonCategory)) {
        result.addonType = queryParamValue;
      }
    }

    return result;
  }
}
