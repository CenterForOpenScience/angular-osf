import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import {
  ArchivingMessageComponent,
  RegistryBlocksSectionComponent,
  RegistryRevisionsComponent,
  RegistryStatusesComponent,
} from '../../components';
import { RegistrationOverviewToolbarComponent } from '../../components/registration-overview-toolbar/registration-overview-toolbar.component';
import { RegistryOverviewMetadataComponent } from '../../components/registry-overview-metadata/registry-overview-metadata.component';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import { RegistrySelectors } from '../../store/registry';

import { RegistryOverviewComponent } from './registry-overview.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryOverviewComponent', () => {
  let component: RegistryOverviewComponent;
  let fixture: ComponentFixture<RegistryOverviewComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    await TestBed.configureTestingModule({
      imports: [
        RegistryOverviewComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          RegistrationOverviewToolbarComponent,
          LoadingSpinnerComponent,
          RegistryOverviewMetadataComponent,
          RegistryRevisionsComponent,
          RegistryStatusesComponent,
          DataResourcesComponent,
          ArchivingMessageComponent,
          WithdrawnMessageComponent,
          RegistryBlocksSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers: [
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideMockStore({
          signals: [
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: RegistrySelectors.isRegistryLoading, value: false },
            { selector: RegistrySelectors.isRegistryAnonymous, value: false },
            { selector: RegistrySelectors.getInstitutions, value: [] },
            { selector: RegistrySelectors.isInstitutionsLoading, value: false },
            { selector: RegistrySelectors.getSchemaBlocks, value: [] },
            { selector: RegistrySelectors.isSchemaBlocksLoading, value: false },
            { selector: RegistrySelectors.areReviewActionsLoading, value: false },
            { selector: RegistrySelectors.getSchemaResponse, value: null },
            { selector: RegistrySelectors.getSchemaResponseLoading, value: false },
            { selector: RegistrySelectors.hasWriteAccess, value: false },
            { selector: RegistrySelectors.hasAdminAccess, value: false },
            { selector: RegistrySelectors.getReviewActions, value: [] },
            { selector: RegistrySelectors.isReviewActionSubmitting, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle loading states', () => {
    expect(component.isRegistryLoading()).toBe(false);
    expect(component.isSchemaBlocksLoading()).toBe(false);
    expect(component.areReviewActionsLoading()).toBe(false);
  });

  it('should handle registry data', () => {
    expect(component.registry()).toBeNull();
    expect(component.isAnonymous()).toBe(false);
    expect(component.schemaBlocks()).toEqual([]);
    expect(component.currentRevision()).toBeNull();
  });

  it('should handle permissions', () => {
    expect(component.hasWriteAccess()).toBe(false);
    expect(component.hasAdminAccess()).toBe(false);
  });

  it('should open revision', () => {
    const revisionIndex = 1;
    component.openRevision(revisionIndex);
    expect(component.selectedRevisionIndex()).toBe(revisionIndex);
  });
});
