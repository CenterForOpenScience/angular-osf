import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomItemMetadataRecord, Metadata } from '@osf/features/metadata/models';
import { SubjectModel } from '@osf/shared/models';

import { TagsInputComponent } from '../tags-input/tags-input.component';

import {
  MetadataAffiliatedInstitutionsComponent,
  MetadataContributorsComponent,
  MetadataDescriptionComponent,
  MetadataLicenseComponent,
  MetadataPublicationDoiComponent,
  MetadataSubjectsComponent,
} from './components';

@Component({
  selector: 'osf-shared-metadata',
  imports: [
    MetadataSubjectsComponent,
    TranslatePipe,
    TagsInputComponent,
    MetadataPublicationDoiComponent,
    MetadataLicenseComponent,
    MetadataAffiliatedInstitutionsComponent,
    MetadataDescriptionComponent,
    MetadataContributorsComponent,
    DatePipe,
    Card,
  ],
  templateUrl: './shared-metadata.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedMetadataComponent {
  metadata = input.required<Metadata | null>();
  customItemMetadata = input.required<CustomItemMetadataRecord>();
  selectedSubjects = input.required<SubjectModel[]>();
  isSubjectsUpdating = input.required<boolean>();
  hideEditDoiAndLicence = input<boolean>(false);
  readonly = input<boolean>(false);

  openEditContributorDialog = output<void>();
  openEditDescriptionDialog = output<void>();
  openEditResourceInformationDialog = output<void>();
  openEditFundingDialog = output<void>();
  openEditAffiliatedInstitutionsDialog = output<void>();
  openEditLicenseDialog = output<void>();
  handleEditDoi = output<void>();
  tagsChanged = output<string[]>();

  getSubjectChildren = output<string>();
  searchSubjects = output<string>();
  updateSelectedSubjects = output<SubjectModel[]>();
}
