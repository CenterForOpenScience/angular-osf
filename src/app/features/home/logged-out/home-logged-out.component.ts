import { Component, inject, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgOptimizedImage } from '@angular/common';
import { slides, integrationIcons } from './data';
import {
  IS_MEDIUM,
  IS_SMALL,
  IS_WEB,
  IS_XSMALL,
} from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'osf-home-logged-out',
  standalone: true,
  imports: [CarouselModule, FormsModule, Button, InputText, NgOptimizedImage],
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
