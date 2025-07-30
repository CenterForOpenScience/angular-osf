import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomItemMetadataRecord } from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';
import { TagsInputComponent } from '@shared/components';
import { SubjectModel } from '@shared/models';

import {
  ProjectMetadataAffiliatedInstitutionsComponent,
  ProjectMetadataContributorsComponent,
  ProjectMetadataDescriptionComponent,
  ProjectMetadataFundingComponent,
  ProjectMetadataLicenseComponent,
  ProjectMetadataPublicationDoiComponent,
  ProjectMetadataResourceInformationComponent,
  ProjectMetadataSubjectsComponent,
} from './components';

@Component({
  selector: 'osf-shared-metadata',
  imports: [
    ProjectMetadataSubjectsComponent,
    TranslatePipe,
    TagsInputComponent,
    ProjectMetadataPublicationDoiComponent,
    ProjectMetadataLicenseComponent,
    ProjectMetadataAffiliatedInstitutionsComponent,
    ProjectMetadataFundingComponent,
    ProjectMetadataResourceInformationComponent,
    ProjectMetadataDescriptionComponent,
    ProjectMetadataContributorsComponent,
    DatePipe,
    Card,
  ],
  templateUrl: './shared-metadata.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedMetadataComponent {
  currentInstance = input.required<ProjectOverview>();
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
