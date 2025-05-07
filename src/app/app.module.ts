import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { AddonsState } from '@osf/features/settings/addons/store';
import { SearchState } from '@osf/features/search/store';
import { TokensState } from '@osf/features/settings/tokens/store';

@NgModule({
  imports: [
    NgxsModule.forRoot([AuthState, TokensState, AddonsState, SearchState]),
  ],
})
export class AppModule {}
