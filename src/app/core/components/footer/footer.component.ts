import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SocialIcon } from '@osf/shared/entities/social-icon.interface';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'osf-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly socialIcons: SocialIcon[] = [
    {
      name: 'twitter',
      url: '#',
      ariaLabel: 'X (formerly Twitter)',
    },
    {
      name: 'facebook',
      url: '#',
      ariaLabel: 'Facebook',
    },
    {
      name: 'group',
      url: '#',
      ariaLabel: 'Group',
    },
    {
      name: 'github',
      url: '#',
      ariaLabel: 'GitHub',
    },
  ];
}
