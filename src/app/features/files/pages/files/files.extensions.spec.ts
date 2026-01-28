import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ExtensionRegistry } from '@core/services/extension-registry.service';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { FilesSelectors } from '../../store';

import { FilesComponent } from './files.component';

import { getConfiguredAddonsMappedData } from '@testing/data/addons/addons.configured.data';
import { getNodeFilesMappedData } from '@testing/data/files/node.data';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('FilesComponent (extensions)', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let component: FilesComponent;
  let registry: ExtensionRegistry | null;

  const currentFolder = getNodeFilesMappedData(0);

  beforeEach(async () => {
    registry = null;
    await TestBed.configureTestingModule({
      imports: [FilesComponent, OSFTestingModule],
      providers: [
        FilesService,
        MockProvider(CustomConfirmationService),
        MockProvider(CustomDialogService),
        MockProvider(ToastService),
        MockProvider(DataciteService),
        MockProvider(ActivatedRoute, {
          params: of({ fileProvider: 'osfstorage' }),
          parent: {
            parent: {
              snapshot: { data: { resourceType: 'nodes' } },
              parent: { params: of({ id: 'node' }) },
            },
          },
        }),
        { provide: ENVIRONMENT, useValue: { webUrl: 'https://osf.io', apiDomainUrl: 'https://api.osf.io' } },
        MockProvider(Router, { navigate: jest.fn(), url: '/' }),
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getFiles, value: signal([]) },
            { selector: FilesSelectors.getFilesTotalCount, value: signal(0) },
            { selector: FilesSelectors.isFilesLoading, value: signal(false) },
            { selector: FilesSelectors.getCurrentFolder, value: signal(currentFolder) },
            { selector: FilesSelectors.getProvider, value: signal('osfstorage') },
            { selector: CurrentResourceSelectors.getResourceDetails, value: signal({ id: 'node', type: 'nodes' }) },
            { selector: CurrentResourceSelectors.getCurrentResource, value: signal({ id: 'node' }) },
            { selector: FilesSelectors.getRootFolders, value: signal(getNodeFilesMappedData()) },
            { selector: FilesSelectors.isRootFoldersLoading, value: signal(false) },
            { selector: FilesSelectors.getConfiguredStorageAddons, value: signal(getConfiguredAddonsMappedData()) },
            { selector: FilesSelectors.isConfiguredStorageAddonsLoading, value: signal(false) },
            { selector: FilesSelectors.getStorageSupportedFeatures, value: signal({ osfstorage: ['AddUpdateFiles'] }) },
          ],
        }),
      ],
    })
      .overrideComponent(FilesComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    registry = TestBed.inject(ExtensionRegistry);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (registry) {
      (registry as unknown as { _extensions: { set: (val: FileActionExtension[]) => void } })._extensions.set([]);
    }
  });

  it('orders toolbar extensions according to position', () => {
    registry.register([
      {
        id: 'first',
        label: 'First',
        icon: 'fas fa-star',
        position: 'start',
        command: jest.fn(),
      },
      {
        id: 'second',
        label: 'Second',
        icon: 'fas fa-bolt',
        position: 1,
        command: jest.fn(),
      },
    ]);

    const toolbar = component.toolbarButtons();
    expect(toolbar.map((ext) => ext.id)).toEqual(['first', 'second']);
  });

  it('respects disabled flag when rendering toolbar buttons', () => {
    registry.register([
      {
        id: 'disabled',
        label: 'Disabled',
        icon: 'fas fa-ban',
        disabled: () => true,
        command: jest.fn(),
      },
    ]);

    const ext = component.toolbarButtons()[0];
    expect(
      ext.disabled?.({
        target: currentFolder,
        location: 'file-list',
        isViewOnly: false,
        canWrite: true,
      })
    ).toBe(true);
  });
});
