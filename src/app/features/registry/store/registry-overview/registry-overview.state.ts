import { State } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { RegistryOverviewStateModel } from './registry-overview.model';

@Injectable()
@State<RegistryOverviewStateModel>({
  name: 'registryOverview',
  defaults: {
    data: '',
  },
})
export class RegistryOverviewState {}
