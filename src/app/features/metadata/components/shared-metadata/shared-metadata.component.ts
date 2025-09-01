import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomItemMetadataRecord, Metadata } from '@osf/features/metadata/models';
import { TagsInputComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { Institution, SubjectModel } from '@osf/shared/models';

import { MetadataAffiliatedInstitutionsComponent } from '../metadata-affiliated-institutions/metadata-affiliated-institutions.component';
import { MetadataContributorsComponent } from '../metadata-contributors/metadata-contributors.component';
import { MetadataDescriptionComponent } from '../metadata-description/metadata-description.component';
import { MetadataFundingComponent } from '../metadata-funding/metadata-funding.component';
import { MetadataLicenseComponent } from '../metadata-license/metadata-license.component';
import { MetadataPublicationDoiComponent } from '../metadata-publication-doi/metadata-publication-doi.component';
import { MetadataResourceInformationComponent } from '../metadata-resource-information/metadata-resource-information.component';
import { MetadataSubjectsComponent } from '../metadata-subjects/metadata-subjects.component';

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
    MetadataResourceInformationComponent,
    MetadataFundingComponent,
    DatePipe,
    Card,
  ],
  templateUrl: './shared-metadata.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedMetadataComponent {
  metadata = input.required<Metadata | null>();
  customItemMetadata = input.required<CustomItemMetadataRecord | null>();
  selectedSubjects = input.required<SubjectModel[]>();
  isSubjectsUpdating = input.required<boolean>();
  hideEditDoi = input<boolean>(false);
  hideEditLicence = input<boolean>(false);
  resourceType = input<ResourceType>(ResourceType.Project);
  readonly = input<boolean>(false);
  affiliatedInstitutions = input<Institution[]>([]);

  openEditContributorDialog = output<void>();
  openEditDescriptionDialog = output<void>();
  openEditResourceInformationDialog = output<void>();
  showResourceInfo = output<void>();
  openEditFundingDialog = output<void>();
  openEditAffiliatedInstitutionsDialog = output<void>();
  openEditLicenseDialog = output<void>();
  handleEditDoi = output<void>();
  tagsChanged = output<string[]>();

  getSubjectChildren = output<string>();
  searchSubjects = output<string>();
  updateSelectedSubjects = output<SubjectModel[]>();
}
