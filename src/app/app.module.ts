import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';

@NgModule({
  imports: [NgxsModule.forRoot([AuthState])],
})
export class AppModule {}
