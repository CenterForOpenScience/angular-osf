import { Component, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgOptimizedImage } from '@angular/common';
import { slides } from './slides';

@Component({
  selector: 'osf-home-logged-out',
  standalone: true,
  imports: [CarouselModule, FormsModule, Button, InputText, NgOptimizedImage],
  templateUrl: './home-logged-out.component.html',
  styleUrl: './home-logged-out.component.scss',
})
export class HomeLoggedOutComponent {
  searchValue = signal('');

  slides = slides;
}
