import { Button, ButtonSeverity } from 'primeng/button';
import { SafeHtmlPipe } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FixSpecialCharPipe } from '@osf/shared/pipes/fix-special-char.pipe';

@Component({
  selector: 'osf-sub-header',
  imports: [Button, Tooltip, Skeleton, SafeHtmlPipe, FixSpecialCharPipe],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubHeaderComponent {
  showButton = input<boolean>(false);
  buttonLabel = input<string>('');
  buttonSeverity = input<ButtonSeverity>('primary');
  title = input<string>('');
  icon = input<string>('');
  tooltip = input<string>('');
  description = input<string>('');
  isLoading = input<boolean>(false);
  isSubmitting = input<boolean>(false);
  isButtonDisabled = input<boolean>(false);
  buttonClick = output<void>();
}
