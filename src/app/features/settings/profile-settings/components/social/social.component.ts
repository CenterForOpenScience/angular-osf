import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Social } from '@osf/shared/models';

import { socials } from '../../constants/data';
import { SOCIAL_KEYS, SocialLinksForm, SocialLinksKeys, UserSocialLink } from '../../models';
import { ProfileSettingsSelectors, UpdateProfileSettingsSocialLinks } from '../../store';

@Component({
  selector: 'osf-social',
  imports: [Button, SelectModule, InputGroup, InputGroupAddon, InputText, ReactiveFormsModule, TranslatePipe],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialComponent {
  @HostBinding('class') class = 'flex flex-column gap-5';

  protected readonly socials = socials;
  readonly userSocialLinks: UserSocialLink[] = [];

  readonly actions = createDispatchMap({ updateProfileSettingsSocialLinks: UpdateProfileSettingsSocialLinks });
  readonly socialLinks = select(ProfileSettingsSelectors.socialLinks);

  readonly fb = inject(FormBuilder);
  readonly socialLinksForm = this.fb.group({ links: this.fb.array<SocialLinksForm>([]) });

  constructor() {
    effect(() => {
      const socialLinks = this.socialLinks();

      for (const socialLinksKey in socialLinks) {
        const socialLink = socialLinks[socialLinksKey as SocialLinksKeys];

        const socialLinkGroup = this.fb.group({
          socialOutput: [this.socials.find((social) => social.key === socialLinksKey), Validators.required],
          webAddress: [socialLink, Validators.required],
        });

        this.links.push(socialLinkGroup);
      }
    });
  }

  get links(): FormArray {
    return this.socialLinksForm.get('links') as FormArray;
  }

  addLink(): void {
    const linkGroup = this.fb.group({
      socialOutput: [this.socials[0], Validators.required],
      webAddress: ['', Validators.required],
    });

    this.links.push(linkGroup);
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  getDomain(index: number): string {
    return this.links.at(index).get('socialOutput')?.value?.address;
  }

  getPlaceholder(index: number): string {
    return this.links.at(index).get('socialOutput')?.value?.placeholder;
  }

  saveSocialLinks(): void {
    const links = this.socialLinksForm.value.links as SocialLinksForm[];

    const mappedLinks = links.map((link) => {
      const key = link.socialOutput.key as SocialLinksKeys;

      const value = SOCIAL_KEYS.includes(key) ? [link.webAddress] : link.webAddress;

      return {
        [key]: value,
      };
    }) satisfies Partial<Social>[];

    this.actions.updateProfileSettingsSocialLinks({ socialLinks: mappedLinks });
  }
}
