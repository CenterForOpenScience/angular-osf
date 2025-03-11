import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'osf-header',
  imports: [Button, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  #router = inject(Router);

  #currentUrl = toSignal(this.#router.events.pipe(map(() => this.#router.url)));

  protected readonly authButtonText = computed(() =>
    this.#currentUrl()?.includes('sign-up') ? 'Sign In' : 'Sign Up',
  );

  protected readonly authButtonLink = computed(() =>
    this.#currentUrl()?.includes('sign-up') ? '/login' : '/sign-up',
  );
}
