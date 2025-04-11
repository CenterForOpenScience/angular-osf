import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@core/store/auth';
import { HomeState } from '@core/store/home';
import { SearchState } from '@osf/features/search/store';

@NgModule({
  imports: [NgxsModule.forRoot([AuthState, HomeState, SearchState])],
})
export class AppModule {}
