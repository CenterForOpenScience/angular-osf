import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SocialIcon } from '@osf/shared/entities/social-icon.interface';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'osf-footer',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly socialIcons: SocialIcon[] = [
    {
      name: 'x',
      icon: 'assets/icons/socials/x.svg',
      url: '#',
      ariaLabel: 'X (formerly Twitter)',
    },
    {
      name: 'facebook',
      icon: 'assets/icons/socials/facebook.svg',
      url: '#',
      ariaLabel: 'Facebook',
    },
    {
      name: 'group',
      icon: 'assets/icons/socials/group.svg',
      url: '#',
      ariaLabel: 'Group',
    },
    {
      name: 'github',
      icon: 'assets/icons/socials/github.svg',
      url: '#',
      ariaLabel: 'GitHub',
    },
  ];
}
