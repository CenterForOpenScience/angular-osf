import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { EMPTY, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { RegistryResource } from '../../models';
import { RegistryResourcesSelectors } from '../../store/registry-resources';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

import { EditResourceDialogComponent } from './edit-resource-dialog.component';

const MOCK_RESOURCE: RegistryResource = {
  id: 'resource-123',
  pid: '10.1234/test.doi',
  type: RegistryResourceType.Data,
  description: 'Test resource description',
  finalized: false,
};

describe('EditResourceDialogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditResourceDialogComponent, ...MockComponents(LoadingSpinnerComponent, ResourceFormComponent)],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: { id: 'registry-123', resource: MOCK_RESOURCE } }),
        provideMockStore({
          signals: [{ selector: RegistryResourcesSelectors.isCurrentResourceLoading, value: false }],
        }),
      ],
    });
  });

  it('should initialize form with resource data', () => {
    const fixture = TestBed.createComponent(EditResourceDialogComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.value).toEqual({
      pid: MOCK_RESOURCE.pid,
      resourceType: MOCK_RESOURCE.type,
      description: MOCK_RESOURCE.description,
    });
  });

  it('should not dispatch when form is invalid', () => {
    const fixture = TestBed.createComponent(EditResourceDialogComponent);
    fixture.detectChanges();
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.componentInstance.form.get('pid')?.setValue('');
    fixture.componentInstance.save();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch UpdateResource and close dialog on success', () => {
    const fixture = TestBed.createComponent(EditResourceDialogComponent);
    fixture.detectChanges();
    const store = TestBed.inject(Store);
    const dialogRef = TestBed.inject(DynamicDialogRef);
    vi.spyOn(store, 'dispatch').mockReturnValue(of(undefined));

    fixture.componentInstance.form.patchValue({
      pid: '10.1234/updated',
      resourceType: 'paper',
      description: 'Updated description',
    });
    fixture.componentInstance.save();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        registryId: 'registry-123',
        resourceId: MOCK_RESOURCE.id,
        resource: { pid: '10.1234/updated', resource_type: 'paper', description: 'Updated description' },
      })
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should not close dialog when dispatch does not emit success', () => {
    const fixture = TestBed.createComponent(EditResourceDialogComponent);
    fixture.detectChanges();
    const store = TestBed.inject(Store);
    const dialogRef = TestBed.inject(DynamicDialogRef);
    vi.spyOn(store, 'dispatch').mockReturnValue(EMPTY);

    fixture.componentInstance.form.patchValue({
      pid: '10.1234/updated',
      resourceType: 'paper',
      description: '',
    });
    fixture.componentInstance.save();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
