import { TranslatePipe } from '@ngx-translate/core';

import { ToastModule } from 'primeng/toast';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-toast',
  imports: [ToastModule, TranslatePipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {}
