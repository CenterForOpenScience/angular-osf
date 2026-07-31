import { MockProvider } from 'ng-mocks';

import { NEVER, of, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileProvider } from '@osf/features/files/constants';
import { ProjectDownloadMenuItem } from '@osf/features/my-projects/models/project-download-menu-item.model';
import { ProjectDownloadOption } from '@osf/features/my-projects/models/project-download-option.model';
import { ProjectDownloadOptionsService } from '@osf/features/my-projects/services/project-download-options.service';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ProjectDownloadMenuComponent } from './project-download-menu.component';

describe('ProjectDownloadMenuComponent', () => {
  let component: ProjectDownloadMenuComponent;
  let fixture: ComponentFixture<ProjectDownloadMenuComponent>;
  let downloadOptionsService: Pick<ProjectDownloadOptionsService, 'loadOptions' | 'executeDownload'>;

  const metadataOption: ProjectDownloadOption = {
    id: 'metadata',
    label: 'myProjects.table.download.metadata',
    type: 'metadata',
  };

  const addonOption: ProjectDownloadOption = {
    id: `addon-${FileProvider.GoogleDrive}`,
    label: 'myProjects.table.download.addonFiles',
    labelParams: { addonName: 'My Google Drive' },
    type: 'addon',
    downloadLink: '/gdrive-download-link',
  };

  const options: ProjectDownloadOption[] = [metadataOption, addonOption];

  function mockMenuRefs() {
    const menuTrigger = { nativeElement: document.createElement('div') };
    const menu = { toggle: vi.fn(), hide: vi.fn() };

    vi.spyOn(component, 'menuTrigger').mockReturnValue(menuTrigger as never);
    vi.spyOn(component, 'menu').mockReturnValue(menu as never);

    return { menuTrigger, menu };
  }

  beforeEach(() => {
    downloadOptionsService = {
      loadOptions: vi.fn().mockReturnValue(of(options)),
      executeDownload: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ProjectDownloadMenuComponent],
      providers: [provideOSFCore(), MockProvider(ProjectDownloadOptionsService, downloadOptionsService)],
    });

    fixture = TestBed.createComponent(ProjectDownloadMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectId', 'project-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load options and open menu on download click', () => {
    const { menuTrigger, menu } = mockMenuRefs();

    component.onDownloadClick();

    expect(downloadOptionsService.loadOptions).toHaveBeenCalledWith('project-1');
    expect(component.isLoading()).toBe(false);
    expect(component.menuItems()).toEqual([
      {
        id: metadataOption.id,
        label: metadataOption.label,
        labelParams: metadataOption.labelParams,
        option: metadataOption,
      },
      {
        id: addonOption.id,
        label: addonOption.label,
        labelParams: addonOption.labelParams,
        option: addonOption,
      },
    ]);
    expect(menu.toggle).toHaveBeenCalledWith({ currentTarget: menuTrigger.nativeElement });
  });

  it('should ignore download click while loading', () => {
    vi.mocked(downloadOptionsService.loadOptions).mockReturnValue(NEVER);
    mockMenuRefs();

    component.onDownloadClick();
    component.onDownloadClick();

    expect(downloadOptionsService.loadOptions).toHaveBeenCalledTimes(1);
    expect(component.isLoading()).toBe(true);
  });

  it('should reset loading state after options load completes', () => {
    mockMenuRefs();

    component.onDownloadClick();

    expect(component.isLoading()).toBe(false);
  });

  it('should execute download when menu item is selected', () => {
    const { menu } = mockMenuRefs();
    const menuItem: ProjectDownloadMenuItem = {
      id: metadataOption.id,
      label: metadataOption.label,
      option: metadataOption,
    };

    component.onMenuItemSelect(menuItem, new Event('click'));

    expect(downloadOptionsService.executeDownload).toHaveBeenCalledWith('project-1', metadataOption);
    expect(menu.hide).toHaveBeenCalled();
  });

  it('should stop event propagation when menu item is selected', () => {
    mockMenuRefs();
    const event = new Event('click');
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
    const menuItem: ProjectDownloadMenuItem = {
      id: metadataOption.id,
      label: metadataOption.label,
      option: metadataOption,
    };

    component.onMenuItemSelect(menuItem, event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should fall back to metadata option when loading fails', () => {
    vi.mocked(downloadOptionsService.loadOptions).mockReturnValue(throwError(() => new Error('failed')));
    const { menuTrigger, menu } = mockMenuRefs();

    component.onDownloadClick();

    expect(component.isLoading()).toBe(false);
    expect(component.menuItems()).toEqual([
      {
        id: metadataOption.id,
        label: metadataOption.label,
        labelParams: metadataOption.labelParams,
        option: metadataOption,
      },
    ]);
    expect(menu.toggle).toHaveBeenCalledWith({ currentTarget: menuTrigger.nativeElement });
  });

  it('should not open menu when menu viewChild is missing', () => {
    const menuTrigger = { nativeElement: document.createElement('div') };
    vi.spyOn(component, 'menuTrigger').mockReturnValue(menuTrigger as never);
    vi.spyOn(component, 'menu').mockReturnValue(undefined as never);

    component.onDownloadClick();

    expect(component.menuItems()).toHaveLength(2);
  });
});
