import { Component, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'osf-home-logged-out',
  standalone: true,
  imports: [CarouselModule, FormsModule, Button, InputText, NgOptimizedImage],
  templateUrl: './home-logged-out.component.html',
  styleUrl: './home-logged-out.component.scss',
})
export class HomeLoggedOutComponent {
  searchValue = signal('');

  slides = [
    {
      img: 'assets/images/carousel1.png',
      name: '2-st slide',
      title:
        'OSF is a game changer for those wanting to effectively share their research process in the spirit of collaboration.',
      author: 'Patricia Ayala',
      facility: 'Research Services Librarian | University of Toronto',
    },
    {
      img: 'assets/images/carousel2.png',
      name: '1-st slide',
      title:
        'OSF is indispensable in helping me create reproducible research pipelines from preregistration through data collection and analysis. Its versatility makes it my one-stop shop for projects. The Dropbox integration effortlessly transforms my existing local workflow to public repository.',
      author: 'Maya Mathur',
      facility: 'Department of Epidemiology Harvard University',
    },
    {
      img: 'assets/images/carousel3.png',
      name: '1-st slide',
      title:
        'Because SocArXiv is a not-for-profit organization, researchers can be assured that they are sharing their research in an environment where access, inclusivity, and preservation, rather than profit, will remain at the heart of the mission. A great benefit of partnering with OSF is that this application is a free public good.',
      author: 'Philip Cohen',
      facility: 'SocArXiv papers',
    },
  ];
}
