import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormComponent } from '@osf/features/registry/components';
import { RegistryResourcesSelectors } from '@osf/features/registry/store/registry-resources';
import { LoadingSpinnerComponent } from '@shared/components';

import { EditResourceDialogComponent } from './edit-resource-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('EditResourceDialogComponent', () => {
  let component: EditResourceDialogComponent;
  let fixture: ComponentFixture<EditResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditResourceDialogComponent,
        OSFTestingModule,
        ...MockComponents(LoadingSpinnerComponent, ResourceFormComponent),
      ],
      providers: [
        MockProvider(DynamicDialogRef, { close: jest.fn() }),
        MockProvider(DynamicDialogConfig, {
          data: {
            id: 'reg-1',
            resource: { id: 'res-1', pid: '10.1234/test', type: 'dataset', description: 'Test resource description' },
          },
        }),
        provideMockStore({
          signals: [{ selector: RegistryResourcesSelectors.isCurrentResourceLoading, value: false }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with resource data', () => {
    expect(component.form.get('pid')?.value).toBe('10.1234/test');
    expect(component.form.get('resourceType')?.value).toBe('dataset');
    expect(component.form.get('description')?.value).toBe('Test resource description');
  });

  it('should have form validators', () => {
    const pidControl = component.form.get('pid');
    const resourceTypeControl = component.form.get('resourceType');

    expect(pidControl?.hasError('required')).toBe(false);
    expect(resourceTypeControl?.hasError('required')).toBe(false);
  });
});
