import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';

@NgModule({
  imports: [NgxsModule.forRoot([AuthState, TokensState])],
})
export class AppModule {}
