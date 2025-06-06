import { createDispatchMap } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GetCurrentUser } from '@core/store/user';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet, ToastComponent, FullScreenLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  actions = createDispatchMap({ getCurrentUser: GetCurrentUser });

  ngOnInit(): void {
    this.actions.getCurrentUser();
  }
}
