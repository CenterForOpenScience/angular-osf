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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { socials } from '@osf/features/settings/profile-settings/data';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { UserPosition } from '@osf/features/settings/profile-settings/entities/user-position.entity';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';
import { TabOption } from '@osf/shared/entities/tab-option.interface';
import { Select } from 'primeng/select';
import { EducationComponent } from '@osf/features/settings/profile-settings/education/education.component';

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
    Checkbox,
    DatePicker,
    Select,
    FormsModule,
    EducationComponent,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent implements OnInit {
  protected defaultTabValue = 0;
  readonly #fb = inject(FormBuilder);
  readonly socials = socials;

  readonly userSocialLinks: UserSocialLink[] = [];
  readonly userPositions: UserPosition[] = [];
  readonly socialLinksForm = this.#fb.group({
    links: this.#fb.array([]),
  });

  readonly employmentForm = this.#fb.group({
    positions: this.#fb.array([]),
  });
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions: TabOption[] = [
    { label: 'Name', value: 0 },
    { label: 'Social', value: 1 },
    { label: 'Employment', value: 2 },
    { label: 'Education', value: 3 },
  ];
  protected selectedTab = this.defaultTabValue;

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  ngOnInit(): void {
    if (!this.userSocialLinks.length) {
      this.addLink();
    }

    if (!this.userPositions.length) {
      this.addPosition();
    }
  }

  // Social links methods
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

  // Employment methods
  get positions(): FormArray {
    return this.employmentForm.get('positions') as FormArray;
  }

  addPosition(): void {
    const positionGroup = this.#fb.group({
      jobTitle: ['', Validators.required],
      department: [''],
      institution: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      presentlyEmployed: [false],
    });

    this.positions.push(positionGroup);
  }

  removePosition(index: number): void {
    this.positions.removeAt(index);
  }

  handleSavePositions(): void {
    // TODO: Implement save positions
  }
}
