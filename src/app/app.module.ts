import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { HomeState } from 'src/app/features/home/store';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';
import { SearchState } from '@osf/features/search/store';

@NgModule({
  imports: [
    NgxsModule.forRoot([
      AuthState,
      TokensState,
      AddonsState,
      HomeState,
      SearchState,
    ]),
  ],
})
export class AppModule {}
