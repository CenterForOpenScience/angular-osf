import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { UserSocialLink } from '@osf/features/settings/profile-settings/entities/user-social-link.entity';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { socials } from '@osf/features/settings/profile-settings/data';

@Component({
  selector: 'osf-profile-settings',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    Button,
    DropdownModule,
    InputText,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddon,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent implements OnInit {
  defaultTabValue = 0;
  #fb: FormBuilder = inject(FormBuilder);
  socials = socials;

  userSocialLinks: UserSocialLink[] = [];
  socialLinksForm = this.#fb.group({
    links: this.#fb.array([]),
  });

  ngOnInit(): void {
    if (!this.userSocialLinks.length) {
      this.addLink();
    }
  }

  get links(): FormArray {
    return this.socialLinksForm.get('links') as FormArray;
  }

  addLink(): void {
    const linkGroup = this.#fb.group({
      socialOutput: [this.socials[0], Validators.required],
      webAddress: ['', Validators.required],
    });

    this.links.push(linkGroup);
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  getDomain(index: number): string {
    return this.links.at(index).get('socialOutput')?.value.address;
  }

  getPlaceholder(index: number): string {
    return this.links.at(index).get('socialOutput')?.value.placeholder;
  }
}
