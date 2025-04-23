import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { HomeState } from 'src/app/features/home/store';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';

@NgModule({
  imports: [
    NgxsModule.forRoot([AuthState, TokensState, AddonsState, HomeState]),
  ],
})
export class AppModule {}
