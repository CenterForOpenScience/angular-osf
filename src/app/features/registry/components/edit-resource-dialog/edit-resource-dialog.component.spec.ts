import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';

import { RegistryResource } from '../../models';
import { RegistryResourcesSelectors } from '../../store/registry-resources';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

import { EditResourceDialogComponent } from './edit-resource-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('EditResourceDialogComponent', () => {
  let component: EditResourceDialogComponent;
  let fixture: ComponentFixture<EditResourceDialogComponent>;
  let store: Store;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  const mockRegistryId = 'registry-123';
  const mockResource: RegistryResource = {
    id: 'resource-123',
    pid: '10.1234/test.doi',
    type: RegistryResourceType.Data,
    description: 'Test resource description',
    finalized: false,
  };

  beforeEach(async () => {
    mockDialogConfig = {
      data: {
        id: mockRegistryId,
        resource: mockResource,
      },
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [
        EditResourceDialogComponent,
        OSFTestingModule,
        ...MockComponents(LoadingSpinnerComponent, ResourceFormComponent),
      ],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({
          signals: [{ selector: RegistryResourcesSelectors.isCurrentResourceLoading, value: false }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditResourceDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should initialize form with resource data', () => {
    expect(component.form.get('pid')?.value).toBe(mockResource.pid);
    expect(component.form.get('resourceType')?.value).toBe(mockResource.type);
    expect(component.form.get('description')?.value).toBe(mockResource.description);
  });

  it('should have required validators on pid and resourceType', () => {
    const pidControl = component.form.get('pid');
    const resourceTypeControl = component.form.get('resourceType');

    expect(pidControl?.hasError('required')).toBe(false);
    expect(resourceTypeControl?.hasError('required')).toBe(false);
  });

  it('should validate pid with DOI validator when invalid format', () => {
    const pidControl = component.form.get('pid');
    pidControl?.setValue('invalid-doi');
    pidControl?.updateValueAndValidity();

    const hasDoiError = pidControl?.hasError('doi') || pidControl?.hasError('invalidDoi');
    expect(hasDoiError).toBe(true);
  });

  it('should accept valid DOI format', () => {
    const pidControl = component.form.get('pid');
    pidControl?.setValue('10.1234/valid.doi');

    expect(pidControl?.hasError('doi')).toBe(false);
  });

  it('should mark form as invalid when pid is empty', () => {
    component.form.get('pid')?.setValue('');
    component.form.get('pid')?.markAsTouched();

    expect(component.form.invalid).toBe(true);
  });

  it('should mark form as invalid when resourceType is empty', () => {
    component.form.get('resourceType')?.setValue('');
    component.form.get('resourceType')?.markAsTouched();

    expect(component.form.invalid).toBe(true);
  });

  it('should mark form as valid when all required fields are filled with valid values', () => {
    component.form.patchValue({
      pid: '10.1234/test',
      resourceType: 'dataset',
      description: 'Test description',
    });

    expect(component.form.valid).toBe(true);
  });

  it('should dispatch UpdateResource action with correct parameters when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.patchValue({
      pid: '10.1234/updated',
      resourceType: 'paper',
      description: 'Updated description',
    });

    component.save();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        registryId: mockRegistryId,
        resourceId: mockResource.id,
        resource: expect.objectContaining({
          pid: '10.1234/updated',
          resource_type: 'paper',
          description: 'Updated description',
        }),
      })
    );
  });

  it('should handle empty description', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.patchValue({
      pid: '10.1234/test',
      resourceType: 'dataset',
      description: '',
    });

    component.save();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: expect.objectContaining({
          description: '',
        }),
      })
    );
  });

  it('should handle null form values by converting to empty strings', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.form.patchValue({
      pid: '10.1234/test',
      resourceType: 'dataset',
      description: null,
    });

    component.save();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: expect.objectContaining({
          pid: '10.1234/test',
          resource_type: 'dataset',
          description: '',
        }),
      })
    );
  });
});
