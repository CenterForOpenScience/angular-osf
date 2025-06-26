import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Carousel } from 'primeng/carousel';

import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { IconComponent, SearchInputComponent } from '@osf/shared/components';

import { integrationIcons, slides } from './data';

@Component({
  selector: 'osf-home-logged-out',
  imports: [Carousel, Button, SearchInputComponent, IconComponent, NgOptimizedImage, TranslatePipe],
  templateUrl: './home-logged-out.component.html',
  styleUrl: './home-logged-out.component.scss',
})
export class HomeLoggedOutComponent {
  icons = integrationIcons;
  slides = slides;
}
