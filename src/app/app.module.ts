import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { HomeState } from '@core/store/home';

@NgModule({
  imports: [NgxsModule.forRoot([AuthState, HomeState])],
})
export class AppModule {}
