import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';

@NgModule({
  imports: [NgxsModule.forRoot([AuthState, TokensState, AddonsState])],
})
export class AppModule {}
