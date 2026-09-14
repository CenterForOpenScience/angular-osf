import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { FileBrowserInfoComponent } from './file-browser-info.component';

describe('FileBrowserInfoComponent', () => {
  let component: FileBrowserInfoComponent;
  let fixture: ComponentFixture<FileBrowserInfoComponent>;
  let dialogRef: DynamicDialogRef;

  function setup(resourceType?: ResourceType): void {
    const dialogConfigMock: Pick<DynamicDialogConfig, 'data'> = { data: resourceType };

    TestBed.configureTestingModule({
      imports: [FileBrowserInfoComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, dialogConfigMock),
        provideMockStore({
          signals: [{ selector: UserSelectors.isProjectReadOnly, value: false }],
        }),
      ],
    });

    fixture = TestBed.createComponent(FileBrowserInfoComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup(ResourceType.Project);

    expect(component).toBeTruthy();
  });

  it('should set resourceType from dialog config', () => {
    setup(ResourceType.Registration);

    expect(component.resourceType).toBe(ResourceType.Registration);
  });

  it('should default to Project when config data is undefined', () => {
    setup();

    expect(component.resourceType).toBe(ResourceType.Project);
  });

  it('should filter items for project resource type', () => {
    setup(ResourceType.Project);

    expect(component.filteredInfoItems.length).toBe(component.infoItems.length);
  });

  it('should filter items for registration resource type', () => {
    setup(ResourceType.Registration);

    expect(component.filteredInfoItems.length).toBeLessThan(component.infoItems.length);
    expect(
      component.filteredInfoItems.every((item) => item.showForResourceTypes.includes(ResourceType.Registration))
    ).toBe(true);
  });

  it('should close dialog when close method is called', () => {
    setup(ResourceType.Project);

    component.dialogRef.close();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
