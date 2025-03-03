import { Component } from '@angular/core';
import { LoginComponent } from '@osf/features/auth/login/login.component';

@Component({
  standalone: true,
  selector: 'osf-main-content',
  imports: [LoginComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {}
