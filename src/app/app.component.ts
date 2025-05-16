import { Store } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GetCurrentUser } from '@core/store/user/user.actions';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  #store = inject(Store);
  title = 'osf';

  ngOnInit(): void {
    this.#store.dispatch(GetCurrentUser);
  }
}
