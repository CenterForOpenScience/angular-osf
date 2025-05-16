import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-meetings-landing',
  imports: [SubHeaderComponent, Card, SearchInputComponent, TranslatePipe, Button],
  templateUrl: './meetings-landing.component.html',
  styleUrl: './meetings-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsLandingComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  readonly isXSmall = toSignal(inject(IS_XSMALL));

  searchValue = signal<string>('');
}
