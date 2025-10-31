import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewToolbarComponent } from '@osf/features/project/overview/components';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { ResourceMetadataComponent } from '@osf/shared/components/resource-metadata/resource-metadata.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { ArchivingMessageComponent, RegistryRevisionsComponent, RegistryStatusesComponent } from '../../components';
import { WithdrawnMessageComponent } from '../../components/withdrawn-message/withdrawn-message.component';
import { RegistryOverviewSelectors } from '../../store/registry-overview';

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
          OverviewToolbarComponent,
          LoadingSpinnerComponent,
          ResourceMetadataComponent,
          RegistryRevisionsComponent,
          RegistryStatusesComponent,
          DataResourcesComponent,
          ArchivingMessageComponent,
          WithdrawnMessageComponent,
          RegistrationBlocksDataComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      providers: [
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideMockStore({
          signals: [
            { selector: RegistryOverviewSelectors.getRegistry, value: null },
            { selector: RegistryOverviewSelectors.isRegistryLoading, value: false },
            { selector: RegistryOverviewSelectors.isRegistryAnonymous, value: false },
            { selector: RegistryOverviewSelectors.getInstitutions, value: [] },
            { selector: RegistryOverviewSelectors.isInstitutionsLoading, value: false },
            { selector: RegistryOverviewSelectors.getSchemaBlocks, value: [] },
            { selector: RegistryOverviewSelectors.isSchemaBlocksLoading, value: false },
            { selector: RegistryOverviewSelectors.areReviewActionsLoading, value: false },
            { selector: RegistriesSelectors.getSchemaResponse, value: null },
            { selector: RegistriesSelectors.getSchemaResponseLoading, value: false },
            { selector: RegistryOverviewSelectors.hasWriteAccess, value: false },
            { selector: RegistryOverviewSelectors.hasAdminAccess, value: false },
            { selector: RegistryOverviewSelectors.hasNoPermissions, value: true },
            { selector: RegistryOverviewSelectors.getReviewActions, value: [] },
            { selector: RegistryOverviewSelectors.isReviewActionSubmitting, value: false },
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
    expect(component.isInstitutionsLoading()).toBe(false);
    expect(component.isSchemaBlocksLoading()).toBe(false);
    expect(component.areReviewActionsLoading()).toBe(false);
    expect(component.isSchemaResponseLoading()).toBe(false);
  });

  it('should handle registry data', () => {
    expect(component.registry()).toBeNull();
    expect(component.isAnonymous()).toBe(false);
    expect(component.institutions()).toEqual([]);
    expect(component.schemaBlocks()).toEqual([]);
    expect(component.currentRevision()).toBeNull();
  });

  it('should handle permissions', () => {
    expect(component.hasWriteAccess()).toBe(false);
    expect(component.hasAdminAccess()).toBe(false);
    expect(component.hasNoPermissions()).toBe(true);
  });

  it('should open revision', () => {
    const revisionIndex = 1;
    component.openRevision(revisionIndex);
    expect(component.selectedRevisionIndex()).toBe(revisionIndex);
  });
});
