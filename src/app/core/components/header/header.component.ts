import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
  standalone: true,
  selector: 'osf-header',
  imports: [RouterLink, BreadcrumbComponent],
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
