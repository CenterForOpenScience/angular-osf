import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { InputText } from 'primeng/inputtext';

import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { IS_MEDIUM, IS_SMALL, IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { integrationIcons, slides } from './data';

@Component({
  selector: 'osf-home-logged-out',
  standalone: true,
  imports: [CarouselModule, FormsModule, Button, InputText, NgOptimizedImage, TranslatePipe],
  templateUrl: './home-logged-out.component.html',
  styleUrl: './home-logged-out.component.scss',
})
export class HomeLoggedOutComponent {
  searchValue = signal('');
  isWeb = toSignal(inject(IS_WEB));
  isMedium = toSignal(inject(IS_MEDIUM));
  isSmall = toSignal(inject(IS_SMALL));
  isXSmall = toSignal(inject(IS_XSMALL));

  icons = integrationIcons;
  slides = slides;
}
