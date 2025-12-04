import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class MyRegistrationsRedirectComponent {
  private readonly router = inject(Router);

  constructor() {
    this.router.navigate(['/my-registrations'], { queryParamsHandling: 'preserve', replaceUrl: true });
  }
}
