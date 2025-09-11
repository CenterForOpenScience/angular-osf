import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Carousel } from 'primeng/carousel';

import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IconComponent, SearchInputComponent } from '@osf/shared/components';

import { INTEGRATION_ICONS, SLIDES } from './constants';

@Component({
  selector: 'osf-home',
  imports: [Carousel, Button, SearchInputComponent, IconComponent, NgOptimizedImage, TranslatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);

  searchControl = new FormControl<string>('');

  readonly icons = INTEGRATION_ICONS;
  readonly slides = SLIDES;

  redirectToSearchPageWithValue() {
    const searchValue = this.searchControl.value;

    this.router.navigate(['/search'], { queryParams: { search: searchValue } });
  }
}
