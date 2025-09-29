import { TranslatePipe } from '@ngx-translate/core';

import { TabsModule } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CedarTemplateFormComponent } from '@osf/features/metadata/components';
import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/metadata/models';
import { MetadataTabsModel } from '@osf/shared/models';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-metadata-tabs',
  imports: [LoadingSpinnerComponent, TabsModule, TranslatePipe, CedarTemplateFormComponent],
  templateUrl: './metadata-tabs.component.html',
  styleUrl: './metadata-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTabsComponent {
  loading = input<boolean>(false);
  tabs = input.required<MetadataTabsModel[]>();
  selectedTab = input.required<string>();
  selectedCedarTemplate = input.required<CedarMetadataDataTemplateJsonApi>();
  selectedCedarRecord = input.required<CedarMetadataRecordData | null>();
  cedarFormReadonly = input<boolean>(true);
  canEdit = input<boolean>(true);
  changeTab = output<string | number>();
  formSubmit = output<CedarRecordDataBinding>();
  toggleFormEdit = output<void>();
  cedarFormChangeTemplate = output<void>();

  onCedarFormSubmit(data: CedarRecordDataBinding) {
    this.formSubmit.emit(data);
  }

  onCedarFormChangeTemplate() {
    this.cedarFormChangeTemplate.emit();
  }

  toggleEditMode() {
    this.toggleFormEdit.emit();
  }
}
